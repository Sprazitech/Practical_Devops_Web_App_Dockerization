terraform {
  backend "s3" {
    bucket = "sprigh-three-tier"
    dynamodb_table = "state-lock"
    key = "terraform/s3-db.tfstate"
    region = "us-east-1"
    encrypt = true 
  }
}