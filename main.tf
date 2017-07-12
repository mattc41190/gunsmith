# Create a VPC to launch our instances into
resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"
}

provider "aws" {
  access_key = "${var.AWS_ACCESS_KEY_ID}"
  secret_key = "${var.AWS_SECRET_ACCESS_KEY}"
  region     = "us-east-1"
}

resource "aws_instance" "bazuka-bird" {
  ami           = "ami-a4c7edb2"
  instance_type = "t2.micro",
  key_name   = "${var.deployer_personal}"

  provisioner "file" {
      source = "/Users/mcale/Desktop/bazuka-bird/commands/docker_install_linux_ami.sh"
      destination = "/tmp/install.sh"
  }
  provisioner "remote-exec" {
      inline = [
          "chmod +x /tmp/install.sh",
          "sudo sh /tmp/install.sh ${var.AWS_SECRET_ACCESS_KEY} ${var.AWS_ACCESS_KEY_ID}"
      ]
  }
  connection {
      user = "${var.instance_username}"
      private_key = "${file(var.private_key_path)}"
  }
}

output "instance_ips" {
  value = "${aws_instance.bazuka-bird.public_ip}"
}
