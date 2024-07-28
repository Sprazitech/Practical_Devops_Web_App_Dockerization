output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.three-tier-vpc.id
}

output "public_subnet_id" {
  description = "ID of the created public subnet"
  value       = [for subnet in aws_subnet.public-subnet : subnet.id]
}

output "private_subnet_id" {
  description = "ID of the created private subnet"
  value       = [for subnet in aws_subnet.private-subnet : subnet.id]
}

output "internet_gateway_id" {
  description = "ID of the created internet gateway"
  value       = aws_internet_gateway.three-tier-igw.id
}

output "nat_gateway_id1" {
  description = "ID of the created NAT gateway"
  value       = aws_nat_gateway.three-tier-ngw1[0]
}

output "nat_gateway_id2" {
  description = "ID of the created NAT gateway"
  value       = aws_nat_gateway.three-tier-ngw2[0].id
}

output "public_route_table_id" {
  description = "ID of the created public route table"
  value       = aws_route_table.public-rtb.id
}

output "private_route_table_id1" {
  description = "ID of the created private route table"
  value       = aws_route_table.private-rtb1.id
}

output "private_route_table_id2" {
  description = "ID of the created private route table"
  value       = aws_route_table.private-rtb2.id
}


output "internet_lb_security_group_id" {
  description = "ID of the created security group"
  value       = aws_security_group.internet_lb_sg.id
}

output "web_tier_security_group_id" {
  description = "ID of the created security group"
  value       = aws_security_group.web_tier_sg.id
}

output "internal_lb_security_group_id" {
  description = "ID of the created security group"
  value       = aws_security_group.internal_lb_sg.id
}

output "app_tier_security_group_id" {
  description = "ID of the created security group"
  value       = aws_security_group.app_tier_sg.id
}

output "db_security_group_id" {
  description = "ID of the created security group"
  value       = aws_security_group.db_sg.id
}
output "lb_dns_name" {
  value       = aws_lb.external_lb.dns_name
  description = "DNS name of ALB."
}