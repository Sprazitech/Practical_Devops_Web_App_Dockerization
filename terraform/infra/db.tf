# DB username and password was manually stored in aws secret manager
data "aws_secretsmanager_secret_version" "creds" {
    secret_id = "db-cred"
}

locals {
  db_creds = jsondecode(
    data.aws_secretsmanager_secret_version.creds.secret_string
  )
}

resource "aws_db_instance" mysql {
  allocated_storage    = 10
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.medium"
  identifier           = "three-tier-db"

  username             = local.db_creds.username
  password             = local.db_creds.password

  skip_final_snapshot  = true 

  db_subnet_group_name =  aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
}

resource "aws_db_subnet_group" "this" {
  name       = "three-tier-subnet-group"
  subnet_ids = [for subnet in aws_subnet.database-subnet : subnet.id]

  tags = {
    Name = "My DB subnet group"
  }
}
