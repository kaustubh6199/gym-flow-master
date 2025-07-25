#!/bin/bash

# Gym Management System - Ubuntu 24.04 LTS Installer
# Repository: https://github.com/kaustubh6199/gym-flow-master.git

echo "🏋️  Installing Gym Management System..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Install Nginx (optional for reverse proxy)
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Clone your repository
echo "📦 Cloning gym-flow-master repository..."
git clone https://github.com/kaustubh6199/gym-flow-master.git
cd gym-flow-master

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Start the application
echo "🚀 Starting gym management system..."
pm2 start "npx serve -s dist -l 3000" --name gym-management
pm2 save
pm2 startup

# Configure Nginx (optional)
echo "⚙️  Configuring Nginx..."
sudo tee /etc/nginx/sites-available/gym-management << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/gym-management /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow 22
sudo ufw --force enable

echo "✅ Installation complete!"
echo ""
echo "🎉 Your Gym Management System is now running!"
echo "🌐 Local access: http://localhost:3000"
echo "🌐 Public access: http://your-server-ip"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status           - Check application status"
echo "   pm2 logs gym-management - View logs"
echo "   pm2 restart gym-management - Restart app"
echo "   pm2 stop gym-management - Stop app"
echo ""
echo "💡 To use a custom domain, update /etc/nginx/sites-available/gym-management"
echo "   and point your domain's DNS to this server's IP address"