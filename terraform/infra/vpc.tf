terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.42.0"
    }
  }
}

resource "aws_vpc" "three-tier-vpc" {
  cidr_block       = var.vpc_cidr
  enable_dns_support = true #gives you an internal domain name#
  enable_dns_hostnames = true #gives you an internal host name#
  
  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}
# Public subnet#
resource "aws_subnet" "public-subnet" {
  vpc_id                 = aws_vpc.three-tier-vpc.id
  count                   = length(var.public_subnets_cidr)
  cidr_block              = element(var.public_subnets_cidr, count.index)
  map_public_ip_on_launch = true #it makes this a public subnet#
  availability_zone       = element(var.azs, count.index)

   depends_on = [aws_internet_gateway.three-tier-igw]

  tags = {
    Name = "Public-subnet ${count.index + 1}"
    Environment = var.environment
  }
}

#Private subnet#
resource "aws_subnet" "private-subnet" {
  vpc_id     = aws_vpc.three-tier-vpc.id
  count      = length(var.private_subnets_cidr)
  cidr_block = element(var.private_subnets_cidr, count.index)
  map_public_ip_on_launch = false #it makes this a public subnet#
  availability_zone = element(var.azs, count.index)

  tags = {
    Name = "Private-subnet ${count.index + 1 }"
    Environment = var.environment
  }
}

#Database subnet
resource "aws_subnet" "database-subnet" {
  vpc_id     = aws_vpc.three-tier-vpc.id
  count      = length(var.db_subnets_cidr)
  cidr_block = element(var.db_subnets_cidr, count.index)
  map_public_ip_on_launch = false #it makes this a public subnet#
  availability_zone = element(var.azs, count.index)

  tags = {
    Name = "Db-Subnetprivate ${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "three-tier-igw" {
  vpc_id = aws_vpc.three-tier-vpc.id

  tags = {
    Name = "${var.environment}-igw"
    Environment = var.environment
  }
}

resource "aws_eip" "three-tier-eip1" {
  count = "1"
  domain = "vpc"
  depends_on = [aws_internet_gateway.three-tier-igw]
}

resource "aws_nat_gateway" "three-tier-ngw1" {
  count = "1"
  allocation_id = aws_eip.three-tier-eip1[count.index].id
  subnet_id     = aws_subnet.public-subnet[count.index].id

  tags = {
    Name = "${var.environment}-ngw1-az1"
    Environment = var.environment
  }

  # To ensure proper ordering, it is recommended to add an explicit dependency
  # on the Internet Gateway for the VPC.
  depends_on = [aws_internet_gateway.three-tier-igw]
}

resource "aws_eip" "three-tier-eip2" {
  count = "1"
  domain       = "vpc"
  depends_on = [aws_internet_gateway.three-tier-igw]
}

 resource "aws_nat_gateway" "three-tier-ngw2" {
  count         = "1"
  allocation_id = aws_eip.three-tier-eip2[count.index].id
  subnet_id     = aws_subnet.public-subnet[count.index + 1].id  # Subnet in the second availability zone (AZ)

  tags = {
    Name        = "${var.environment}-ngw2-az2"
    Environment = var.environment
  }
} 

# resource "aws_internet_gateway_attachment" "example" {
#   internet_gateway_id = aws_internet_gateway.test-igw.id
#   vpc_id              = aws_vpc.test-vpc.id
# }

#Public routetable#
resource "aws_route_table" "public-rtb" {
  vpc_id = aws_vpc.three-tier-vpc.id
  tags = {
    Name = "${var.environment}-public-rtb"
    Environment = var.environment
  }
}
#Private routetable#
resource "aws_route_table" "private-rtb1" {
  vpc_id = aws_vpc.three-tier-vpc.id
  tags = {
    Name = "${var.environment}-private-rtbaz1"
    Environment = var.environment
  }
}

#Private routetable2#
resource "aws_route_table" "private-rtb2" {
  vpc_id = aws_vpc.three-tier-vpc.id
  tags = {
    Name = "${var.environment}-private-rtbaz2"
    Environment = var.environment
  }
}

# Route for Internet Gateway
resource "aws_route" "public-rt" {
  route_table_id         = aws_route_table.public-rtb.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.three-tier-igw.id
}
  
 # Route for NAT Gateway1
resource "aws_route" "private_nat_gateway1" {
  count = 1
  route_table_id         = aws_route_table.private-rtb1.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_nat_gateway.three-tier-ngw1[0].id
} 

# Route for NAT Gateway2
resource "aws_route" "private_nat_gateway2" {
  count = 1
  route_table_id         = aws_route_table.private-rtb2.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_nat_gateway.three-tier-ngw2[0].id
} 

# Route table associations for  Public subnet
resource "aws_route_table_association" "pub-rtb" {
  count = length(var.public_subnets_cidr)
  subnet_id      = element(aws_subnet.public-subnet[*].id, count.index)
  route_table_id = aws_route_table.public-rtb.id
}

# Route table associations for Private subnet  
resource "aws_route_table_association" "private-rtb1-assc" {
  count = 1

  subnet_id      = aws_subnet.private-subnet[0].id
  route_table_id = aws_route_table.private-rtb1.id
}
# Route table associations for Private subnet 2 
resource "aws_route_table_association" "private-rtb2-assc" {
  count = 1

  subnet_id      = aws_subnet.private-subnet[1].id
  route_table_id = aws_route_table.private-rtb2.id
}

# Create the Security Group
/*resource "aws_security_group" "sg" {
  vpc_id       = aws_vpc.test-vpc.id
  name         = "sg"
  description  = "sg"
  
  # allow ingress of port 22
  ingress {
    cidr_blocks = var.ingressCIDRblock  
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  } 
  
  # allow egress of all ports
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
tags = {
  Name = "${var.environment}-sg"
    Environment = var.environment 
  }
}*/