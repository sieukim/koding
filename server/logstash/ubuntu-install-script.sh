# Swap 파일 생성 및 할당. 크기: 64MB * 16 = 1GB
sudo dd if=/dev/zero of=/swapfile bs=64M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo vi /etc/fstab
/swapfile swap swap defaults 0 0

wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
#sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install logstash
# see https://www.elastic.co/guide/en/logstash/7.17/installing-logstash.html

sudo chown ubuntu /etc/logstash
sudo chown ubuntu /usr/share/logstash
sudo systemctl enable logstash
# sudo systemctl start logstash
# journalctl -u logstash -o cat -f
# sudo systemctl kill -s SIGKILL logstash

# 설정은 /etc/logstash 폴더에
