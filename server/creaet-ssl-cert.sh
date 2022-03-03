sudo apt update
sudo apt install letsencrypt -y

pm2 stop main

sudo certbot certonly --standalone -d koding.kr
mkdir secrets
sudo cp /etc/letsencrypt/live/koding.kr/fullchain.pem ./secrets/public-certificate.pem
sudo cp /etc/letsencrypt/live/koding.kr/privkey.pem ./secrets/private-key.pem


pm2 start dist/main.js