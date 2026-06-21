resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.project_name}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_db_instance" "mysql" {
  identifier        = "${var.project_name}-mysql"
  engine            = "mysql"
  engine_version    = "8.0"
  instance_class    = "db.t3.micro"  # Free tier eligible
  allocated_storage = 20
  storage_type      = "gp2"
  storage_encrypted = true

  db_name  = "akademik_db"
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.security_group_id]

  # Backup otomatis tiap hari
  backup_retention_period = 7
  backup_window           = "03:00-04:00"  # jam 3 pagi WIB+7
  maintenance_window      = "Sun:04:00-Sun:05:00"

  # Tidak butuh multi-AZ untuk dev
  multi_az            = false
  publicly_accessible = false
  skip_final_snapshot = true  # ganti false untuk production

  tags = {
    Name        = "${var.project_name}-mysql"
    Environment = var.environment
    Project     = var.project_name
  }
}
