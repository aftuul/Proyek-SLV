terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Simpan state file di S3 (opsional, untuk tim)
  # backend "s3" {
  #   bucket = "proyek-slv-terraform-state"
  #   key    = "prod/terraform.tfstate"
  #   region = "ap-southeast-1"
  # }
}

provider "aws" {
  region = var.aws_region
}

# ── VPC & Networking ─────────────────────────────────
module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
}

# ── EC2 Instance (App Server) ────────────────────────
module "ec2" {
  source = "./modules/ec2"

  project_name      = var.project_name
  environment       = var.environment
  instance_type     = var.instance_type
  subnet_id         = module.vpc.public_subnet_id
  security_group_id = module.vpc.app_security_group_id
  key_name          = var.key_name
}

# ── RDS MySQL (Database) ─────────────────────────────
module "rds" {
  source = "./modules/rds"

  project_name      = var.project_name
  environment       = var.environment
  db_username       = var.db_username
  db_password       = var.db_password
  subnet_ids        = module.vpc.private_subnet_ids
  security_group_id = module.vpc.db_security_group_id
}
