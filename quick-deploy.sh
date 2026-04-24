#!/bin/bash

# Quick deployment using git pull on server
set -e

SERVER_IP="43.205.214.197"
SSH_KEY="/Users/debrajroy/Downloads/multi-vender.pem"
SERVER_USER="ubuntu"

echo "🚀 Quick Deploy to Server"
echo ""

# First, let's commit and push changes to git
echo "📝 Committing changes to git..."
git add .
git commit -m "Add authentication and landing page" || echo "No changes to commit"
git push origin main || git push origin master

echo ""
echo "🔄 Deploying on server..."

ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

APP_DIR="/var/www/appbuilder"
PM2_APP_NAME="appbuilder"

echo "📁 Navigating to app directory..."
cd $APP_DIR || {
    echo "Directory doesn't exist, cloning repository..."
    sudo mkdir -p /var/www
    cd /var/www
    git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
    cd appbuilder
    sudo chown -R ubuntu:ubuntu $APP_DIR
}

echo "📥 Pulling latest changes..."
git pull

echo "📦 Installing dependencies..."
npm install

echo "📝 Setting up environment..."
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
JWT_SECRET="production-jwt-secret-change-this-to-random-string-12345"
EOF

echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo "👥 Creating/updating test user..."
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
  console.log('✅ User created/updated:', user.email);
  
  // Assign all existing data to this user
  const pages = await prisma.page.updateMany({
    data: { customerId: user.id }
  });
  const stores = await prisma.store.updateMany({
    data: { customerId: user.id }
  });
  const colors = await prisma.productColor.updateMany({
    data: { customerId: user.id }
  });
  const media = await prisma.media.updateMany({
    data: { customerId: user.id }
  });
  console.log('✅ Data assigned:', pages.count, 'pages,', stores.count, 'stores,', colors.count, 'colors,', media.count, 'media');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
USEREOF

node create-user.js
rm create-user.js

echo "🔨 Building application..."
npm run build

echo "🔄 Managing PM2 process..."
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

pm2 stop $PM2_APP_NAME 2>/dev/null || true
pm2 delete $PM2_APP_NAME 2>/dev/null || true
pm2 start npm --name $PM2_APP_NAME -- start
pm2 save

echo "✅ Deployment complete!"
ENDSSH

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              🎉 DEPLOYMENT COMPLETE!                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Your application is live at:"
echo "   http://43.205.214.197:3002"
echo ""
echo "🔑 Login with:"
echo "   Email: test@gmail.com"
echo "   Password: 12345"
echo ""
