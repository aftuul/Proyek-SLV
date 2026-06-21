output "ec2_public_ip" {
  description = "IP publik server aplikasi"
  value       = module.ec2.public_ip
}

output "ec2_public_dns" {
  description = "DNS publik server aplikasi"
  value       = module.ec2.public_dns
}

output "rds_endpoint" {
  description = "Endpoint koneksi database MySQL"
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "app_urls" {
  description = "URL tiap microservice"
  value = {
    api_gateway    = "http://${module.ec2.public_ip}:5000"
    user_service   = "http://${module.ec2.public_ip}:3001"
    course_service = "http://${module.ec2.public_ip}:3002"
    krs_service    = "http://${module.ec2.public_ip}:3003"
    monitoring     = "http://${module.ec2.public_ip}:4000"
  }
}

output "vpc_id" {
  description = "ID VPC yang dibuat"
  value       = module.vpc.vpc_id
}
