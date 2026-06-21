variable "aws_region" {
  description = "Region AWS yang digunakan"
  type        = string
  default     = "ap-southeast-1" # Singapore (terdekat dari Indonesia)
}

variable "project_name" {
  description = "Nama proyek"
  type        = string
  default     = "proyek-slv"
}

variable "environment" {
  description = "Environment deployment (dev/staging/prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment harus salah satu dari: dev, staging, prod."
  }
}

variable "vpc_cidr" {
  description = "CIDR block untuk VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "instance_type" {
  description = "Tipe EC2 instance untuk app server"
  type        = string
  default     = "t3.small" # 2 vCPU, 2GB RAM — cukup untuk microservices
}

variable "key_name" {
  description = "Nama SSH key pair di AWS"
  type        = string
  default     = "proyek-slv-key"
}

variable "db_username" {
  description = "Username database MySQL"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "db_password" {
  description = "Password database MySQL"
  type        = string
  sensitive   = true # tidak akan tampil di output/log
}
