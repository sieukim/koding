npm run build
rm dist.zip
zip dist.zip src dist package.json -r
ssh -i ./koding-ec2-keypair-watasieun.pem ubuntu@koding.kr 'cd /app && rm -rf dist dist.zip src package.json; exit'
scp -i ./koding-ec2-keypair-watasieun.pem  dist.zip ubuntu@koding.kr:/app/
ssh -i ./koding-ec2-keypair-watasieun.pem  ubuntu@koding.kr 'cd /app && unzip dist.zip && npm i && sudo pm2 reload all; exit'