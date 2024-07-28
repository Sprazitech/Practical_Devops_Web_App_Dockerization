#Instance profile#
resource "aws_iam_instance_profile" "threetier-iamprofile" {
  name = "iam-profile"
  role = aws_iam_role.threetier-role.name
}

#IAM Role#
resource "aws_iam_role" "threetier-role" {
  name               = "threetier-role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

#Policy attachment for AWS SSM and S3 access#
resource "aws_iam_role_policy_attachment" "example_ssm_policy_attachment" {
  role       = aws_iam_role.threetier-role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "example_s3_policy_attachment" {
  role       = aws_iam_role.threetier-role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

