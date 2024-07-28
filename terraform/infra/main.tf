#Create Internal facing load balancer for Application Tier#
resource "aws_lb" "internal-lb" {
  name               = "app-lb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.internal_lb_sg.id]
  subnets            = [for subnet in aws_subnet.private-subnet : subnet.id]
  depends_on         = [aws_internet_gateway.three-tier-igw]

  tags = {
    Name = "${var.environment}-internal-lb"
  }
}

#Load balancer Listener#
resource "aws_lb_listener" "back_end" {
  load_balancer_arn = aws_lb.internal-lb.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lb-tg.arn
  }
}

#Target group#
resource "aws_lb_target_group" "lb-tg" {
  name     = "backend"
  port     = 4000
  protocol = "HTTP"
  vpc_id   = aws_vpc.three-tier-vpc.id

  health_check {
    path = "/health"
  }
}

# Launch Template Resource #
resource "aws_launch_template" "threetier-LT" {
  name = "app-tier-LT"
  image_id = "ami-07408728c46b949d6"
  instance_type = "t2.micro"

  vpc_security_group_ids = [aws_security_group.app_tier_sg.id]
  update_default_version = true
  block_device_mappings {
    device_name = "/dev/sdf"
    ebs {
      volume_size = 20      
      delete_on_termination = true
      volume_type = "gp2" # default is gp2
     }
  }
  monitoring {
    enabled = true
  }
  iam_instance_profile {
    name = aws_iam_instance_profile.threetier-iamprofile.name
  }
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "app-tier-LT"
    }
  }
}

#Autoscaling Group#
resource "aws_autoscaling_group" "threetier-asg" {
  name = "app-tier-asg"
  desired_capacity   = 1
  max_size           = 2
  min_size           = 1
  vpc_zone_identifier = [for subnet in aws_subnet.private-subnet : subnet.id]
  target_group_arns = [aws_lb_target_group.lb-tg.arn]
  health_check_type = "EC2"
  health_check_grace_period = 300
  

  launch_template {
    id      = aws_launch_template.threetier-LT.id
    version = "$Latest"
  }

   tag {
    key                 = "threetier"
    value               = "asg"
    propagate_at_launch = true
  }
}

# External ALB
resource "aws_lb" "external_lb" {
  name               = "external-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.internet_lb_sg.id]
  subnets            = [for subnet in aws_subnet.public-subnet : subnet.id]

  enable_deletion_protection = false

  tags = {
    Name = "${var.environment}-external-lb"
  }
}

## HTTP Listener ##
resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.external_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

## HTTPS Listener ##   
resource "aws_lb_listener" "ssl" {
  load_balancer_arn = aws_lb.external_lb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:381492292155:certificate/39b55da2-7f7c-447f-a4dd-196865896468"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ftend_tg.arn
  }
}

resource "aws_lb_target_group" "ftend_tg" {
  name     = "front-end"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.three-tier-vpc.id
}

# Web-tier autoscaling group
resource "aws_autoscaling_group" "webtier-LT" {
  name                      = "web-tier-asg"
  max_size                  = 2
  min_size                  = 1
  health_check_grace_period = 300
  health_check_type         = "EC2"
  desired_capacity          = 1
  target_group_arns          = [aws_lb_target_group.ftend_tg.arn]
  vpc_zone_identifier       = [for subnet in aws_subnet.public-subnet : subnet.id]
  
  launch_template {
    id      = aws_launch_template.webtier-LT.id
    version = "$Latest"
  }
  tag {
    key                 = "webtier"
    value               = "asg"
    propagate_at_launch = true
  }
}
#create launch template for web-tier autoscaling group
resource "aws_launch_template" "webtier-LT" {
  name          = "webtier-LT"
  image_id      = "ami-07ac9683a146cd5da"
  instance_type = "t2.micro"
    
  block_device_mappings {
    device_name = "/dev/sdf"
    ebs {
      volume_size = 20      
      delete_on_termination = true
      volume_type = "gp2" # default is gp2
     }
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.threetier-iamprofile.name
  }
  monitoring {
    enabled = true
  }

  vpc_security_group_ids = [aws_security_group.web_tier_sg.id]
  update_default_version = true

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "webtier-LT"
    }
  }
}

# Route 53 Record
resource "aws_route53_record" "threetier_record" {
  name    = "threetier.sprigsh.click"
  type    = "A"
  zone_id = "Z09957423LTZIVVQNUU69"
  alias {
    name                   = aws_lb.external_lb.dns_name
    zone_id                = aws_lb.external_lb.zone_id
    evaluate_target_health = true
  }
}


