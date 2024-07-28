# Create Internet-facing Load Balancer Security Group
resource "aws_security_group" "internet_lb_sg" {
  name        = "internet-lb-sg"
  description = "Security Group for Internet-facing Load Balancer"

  vpc_id = aws_vpc.three-tier-vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow outbound traffic to the internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "internet_lb_sg"
  }
}

# Create Web Tier Security Group
resource "aws_security_group" "web_tier_sg" {
  name        = "web-tier-sg"
  description = "Security Group for Web Tier Instances"

  vpc_id = aws_vpc.three-tier-vpc.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.internet_lb_sg.id]
  }
  # Allow outbound traffic to the internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web_tier_sg"
  }
}

# Create Internal Load Balancer Security Group
resource "aws_security_group" "internal_lb_sg" {
  name        = "internal-lb-sg"
  description = "Security Group for Internal Load Balancer"

  vpc_id = aws_vpc.three-tier-vpc.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.web_tier_sg.id]
  }
  # Allow outbound traffic to the internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "internal_lb_sg"
  }
}

# Create App Tier Security Group
resource "aws_security_group" "app_tier_sg" {
  name        = "app-tier-sg"
  description = "Security Group for App Tier Instances"

  vpc_id = aws_vpc.three-tier-vpc.id

  ingress {
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    security_groups = [aws_security_group.internal_lb_sg.id]
  }
  # Allow outbound traffic to the internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app_tier_sg"
  }
}

# Create Database Security Group
resource "aws_security_group" "db_sg" {
  name        = "db-sg"
  description = "Security Group for Database Instances"

  vpc_id = aws_vpc.three-tier-vpc.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    security_groups = [aws_security_group.app_tier_sg.id]
  }
  # Allow outbound traffic to the internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "db_sg"
  }
}