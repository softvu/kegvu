#!/usr/bin/env bash

# Install node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y redis-server

sudo npm install -g pm2

npm install

(cd api && npm install)

# Install python requirements
pip3 install -r pi/requirements.txt

sudo pm2 startup
pm2 start ecosystem.config.yml

echo "Make sure to run deploy from your dev machine"