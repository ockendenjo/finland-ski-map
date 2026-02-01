data "aws_acm_certificate" "cert" {
  provider = aws.us_east_1
  arn      = var.certificate_arn
}
