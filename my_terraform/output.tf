output "ec2_public_ip" {
  description = "Public IP of the EC2 instance (for browser access)"
  value       = aws_instance.ubuntu_server.public_ip
}

output "rds_endpoint" {
  description = "Private RDS endpoint (accessible only from EC2)"
  value       = aws_db_instance.mysql_db.endpoint
}
