#!/bin/bash

echo "🚀 Starting DostAI Cloud Bootstrapper..."

# 1. Update and Dependencies
sudo apt-get update
sudo apt-get install -y git curl build-essential

# 2. Node.js 20
if ! command -v node &> /dev/null
then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 3. PM2
if ! command -v pm2 &> /dev/null
then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# 4. Firewall Ports (UFW)
echo "Opening Dashboard & Bot Ports (3000-3011)..."
sudo ufw allow 3000:3011/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

echo "✅ System Ready! Now clone your repo and run 'pm2 start ecosystem.config.cjs'"
