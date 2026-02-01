variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-west-1"
}

variable "aws_account_id" {
  description = "AWS account ID"
  type        = string
}

variable "domain_name" {
  description = "Base domain name for Route53 hosted zone"
  type        = string
}

variable "env" {
  description = "Environment name (dev or pro)"
  type        = string

  validation {
    condition     = contains(["dev", "pro"], var.env)
    error_message = "Environment must be either 'dev' or 'pro'."
  }
}

variable "subdomain" {
  description = "Subdomain for the application"
  type        = string
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate in us-east-1"
  type        = string
}
