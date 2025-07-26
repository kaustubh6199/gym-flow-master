#!/bin/bash

# Complete Gym Management System Installer (Frontend + Backend + Database)
# Repository: https://github.com/kaustubh6199/gym-flow-master.git

echo "🏋️  Installing Complete Gym Management System..."
echo "📋 This will install: Frontend + Backend API + PostgreSQL Database"

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
echo "🐳 Installing Docker and Docker Compose..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Install Node.js (for development)
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Clone repository
echo "📦 Cloning gym-flow-master repository..."
git clone https://github.com/kaustubh6199/gym-flow-master.git
cd gym-flow-master

# Setup backend dependencies
echo "📦 Setting up backend..."
cd backend
npm install
cd ..

# Create environment file
echo "⚙️  Creating environment configuration..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://gym_admin:gym_secure_2024@localhost:5432/gym_management

# JWT Secret (change this in production!)
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# API Port
PORT=3001
EOF

# Start the complete system with Docker
echo "🚀 Starting complete gym management system..."
sudo docker compose up -d

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 30

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw allow 3000
sudo ufw allow 3001
sudo ufw allow 5432
sudo ufw --force enable

echo "✅ Installation complete!"
echo ""
echo "🎉 Your Complete Gym Management System is now running!"
echo ""
echo "🌐 Access Points:"
echo "   Frontend:     http://localhost:3000"
echo "   Backend API:  http://localhost:3001"
echo "   Database:     localhost:5432"
echo ""
echo "🔐 Default Login Credentials:"
echo "   Email:        admin@gym.com"
echo "   Password:     admin123"
echo ""
echo "📊 Useful Docker commands:"
echo "   docker compose ps                 - Check service status"
echo "   docker compose logs               - View all logs"
echo "   docker compose logs frontend      - View frontend logs"
echo "   docker compose logs backend       - View backend logs"
echo "   docker compose restart            - Restart all services"
echo "   docker compose down               - Stop all services"
echo "   docker compose up -d              - Start all services"
echo ""
echo "🗄️  Database Access:"
echo "   Host:     localhost"
echo "   Port:     5432"
echo "   Database: gym_management"
echo "   Username: gym_admin"
echo "   Password: gym_secure_2024"
echo ""
echo "⚠️  SECURITY NOTES:"
echo "   - Change default passwords before production use"
echo "   - Update JWT_SECRET in .env file"
echo "   - Configure SSL/TLS for production"
echo "   - Set up proper backup strategy"
echo ""
echo "📚 API Documentation will be available at:"
echo "   http://localhost:3001/health - API health check"