variable "aws_region" {    
    default = "us-east-1"
    description = "AWS region"
}

variable "environment" {
  default = "three-tier"
}

variable "vpc_cidr" {
  default     = "10.0.0.0/16"
  description = "CIDR block of the vpc"
}

variable "public_subnets_cidr" {
  type        = list(any)
  default     = ["10.0.0.0/24", "10.0.1.0/24"]
  description = "CIDR block for Public Subnet"
}

variable "private_subnets_cidr" {
  type        = list(any)
  default     = ["10.0.2.0/24", "10.0.3.0/24"]
  description = "CIDR block for Private Subnet"
}

variable "db_subnets_cidr" {
  type        = list(any)
  default     = ["10.0.4.0/24", "10.0.5.0/24"]
  description = "CIDR block for Database Subnet"
}


variable "azs" {
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d", "us-east-1e", "us-east-1f"]
  description = "Availability Zones"
}

