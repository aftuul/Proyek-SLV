# Ambil AMI Ubuntu 22.04 terbaru secara otomatis
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Ubuntu)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = var.key_name

  # Script yang otomatis jalan saat instance pertama kali nyala
  user_data = <<-EOF
    #!/bin/bash
    set -e

    # Update sistem
    apt-get update -y
    apt-get upgrade -y

    # Install Docker
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # Tambahkan user ubuntu ke group docker
    usermod -aG docker ubuntu

    # Install git
    apt-get install -y git

    # Clone repo Proyek SLV
    cd /home/ubuntu
    git clone https://github.com/aftuul/Proyek-SLV.git
    cd Proyek-SLV

    # Jalankan semua service
    docker compose up -d --build

    echo "Proyek SLV berhasil dideploy!" > /home/ubuntu/deploy.log
  EOF

  root_block_device {
    volume_size = 20    # 20 GB storage
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name        = "${var.project_name}-app-server"
    Environment = var.environment
    Project     = var.project_name
    Role        = "application"
  }
}
