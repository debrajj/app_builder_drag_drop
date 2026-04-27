#!/bin/bash

# Deployment Script for Admin Panel
# EC2 IP: 43.205.214.197
# Port: 3002

echo "🚀 Starting deployment to EC2..."
echo ""

# SSH connection details
SSH_KEY="/Users/debrajroy/Downloads/multi-vender.pem"
EC2_USER="ubuntu"
EC2_HOST="43.205.214.197"
APP_DIR="/var/www/appbuilder"
PORT="3002"

echo "📡 Connecting to EC2 instance..."

# Deploy commands
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << 'ENDSSH'
set -e

echo "📂 Navigating to project directory..."
cd /var/www/appbuilder || {
    echo "❌ Directory not found. Cloning repository..."
    cd /var/www
    git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
    cd appbuilder
}

echo "🔄 Pulling latest changes..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️  Seed already exists or failed"

echo "🏗️  Building application..."
npm run build

echo "🔄 Restarting application with PM2..."
pm2 delete appbuilder 2>/dev/null || true
pm2 start npm --name "appbuilder" -- start
pm2 save

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Main App: http://43.205.214.197:3002"
echo "   Admin Panel: http://43.205.214.197:3002/admin/login"
echo ""
echo "🔑 Admin Credentials:"
echo "   Email: admin@example.com"
echo "   Password: 12345"
echo ""
echo "📊 Check logs with: pm2 logs appbuilder"
echo ""

ENDSSH

echo "✨ Deployment script completed!"
