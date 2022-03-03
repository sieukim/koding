sudo apt update
sudo apt install letsencrypt -y

pm2 stop main

sudo certbot renew
sudo cp /etc/letsencrypt/live/koding.kr/fullchain.pem -d ./secrets/public-certificate.pem
sudo cp /etc/letsencrypt/live/koding.kr/privkey.pem -d ./secrets/private-key.pem


pm2 start dist/main.js