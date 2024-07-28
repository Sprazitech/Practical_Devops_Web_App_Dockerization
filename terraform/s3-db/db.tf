#Create dynamodb
resource "aws_dynamodb_table" "statelock" {
  name           = "state-lock"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}  
