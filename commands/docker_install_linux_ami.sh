# HAVE TFORM PASS ARGS IN
AWS_SECRET_ACCESS_KEY=$1
AWS_ACCESS_KEY_ID=$2
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo docker pull mattc41190/bazuka-bird
docker run -p 3333:3333 -p 80:80 --rm --workdir="/app" -e "PORT=80" -e "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" -e "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" --detach mattc41190/bazuka-bird
