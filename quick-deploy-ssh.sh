#!/bin/bash

# Quick SSH Deployment Script
# Deploys app builder directly via SSH without large file transfers

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║    🚀 QUICK DEPLOY - APP BUILDER TO SERVER                ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
SERVER_IP="43.205.214.197"
SSH_KEY="/Users/debrajroy/Downloads/multi-vender.pem"
SERVER_USER="ubuntu"
APP_DIR="/var/www/appbuilder"
PORT="3002"
PM2_APP_NAME="appbuilder"
GITHUB_REPO="https://github.com/debrajj/app_builder_drag_drop.git"

echo "📋 Configuration:"
echo "   Server: $SERVER_IP:$PORT"
echo "   Directory: $APP_DIR"
echo "   Repository: $GITHUB_REPO"
echo ""

# Deploy via SSH
echo "🚀 Deploying via SSH..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

APP_DIR="/var/www/appbuilder"
PM2_APP_NAME="appbuilder"
GITHUB_REPO="https://github.com/debrajj/app_builder_drag_drop.git"

echo "📁 Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown -R ubuntu:ubuntu $APP_DIR

cd $APP_DIR

# Check if repo already exists
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone $GITHUB_REPO .
fi

echo "📝 Setting up environment..."
cat > .env << 'EOF'
# Production Environment Variables
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
JWT_SECRET="production-jwt-secret-change-this-to-random-string-12345"
EOF

echo "📦 Installing dependencies..."
npm install --production

echo "🔨 Building application..."
npm run build

echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo "👥 Creating test user..."
cat > create-user.js << 'USEREOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('12345', 10);
  const user = await prisma.customer.upsert({
    where: { email: 'test@gmail.com' },
    update: { password },
    create: {
      email: 'test@gmail.com',
      password: password,
      name: 'Test User',
      role: 'customer'
    }
  });
  console.log('User created:', user.email);
  
  // Assign all existing data to this user
  await prisma.page.updateMany({
    where: { customerId: null },
    data: { customerId: user.id }
  });
  await prisma.store.updateMany({
    where: { customerId: null },
    data: { customerId: user.id }
  });
  await prisma.productColor.updateMany({
    where: { customerId: null },
    data: { customerId: user.id }
  });
  await prisma.media.updateMany({
    where: { customerId: null },
    data: { customerId: user.id }
  });
  console.log('Data assigned to user');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
USEREOF

node create-user.js
rm create-user.js

echo "🔄 Managing PM2 process..."
# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Stop existing process if running
pm2 stop $PM2_APP_NAME 2>/dev/null || true
pm2 delete $PM2_APP_NAME 2>/dev/null || true

# Start new process
pm2 start npm --name $PM2_APP_NAME -- run dev

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true

echo "✅ Deployment complete!"
ENDSSH

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║              🎉 DEPLOYMENT COMPLETE!                       ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Your application is now live at:"
echo "   http://43.205.214.197:3002"
echo ""
echo "🔑 Login Credentials:"
echo "   Email: test@gmail.com"
echo "   Password: 12345"
echo ""
echo "📊 Useful Commands:"
echo "   View logs:    ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs $PM2_APP_NAME'"
echo "   Restart app:  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 restart $PM2_APP_NAME'"
echo "   Stop app:     ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 stop $PM2_APP_NAME'"
echo "   Status:       ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 status'"
echo ""
echo "✨ Done!"
