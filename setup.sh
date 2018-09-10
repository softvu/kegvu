#!/usr/bin/env bash

# Install node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install -g pm2

npm install

(cd api && npm install)

# Install python requirements
pip3 install -r api/requirements.txt

pm2 start ecosystem.config.yml