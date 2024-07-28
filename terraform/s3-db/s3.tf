#Create s3
resource "aws_s3_bucket" "bucket" {
    bucket = "sprigh-three-tier"
    tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_versioning" "sprigh" {
  bucket = "sprigh-three-tier"
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "sprigh" {
  bucket = "sprigh-three-tier"

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}
