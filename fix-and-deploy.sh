#!/bin/bash

# Fix and deploy script
set -e

SERVER_IP="43.205.214.197"
SSH_KEY="/Users/debrajroy/Downloads/multi-vender.pem"
SERVER_USER="ubuntu"

echo "🔧 Fixing and deploying..."
echo ""

ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" bash << 'ENDSSH'
set -e

APP_DIR="/var/www/appbuilder"
PM2_APP_NAME="appbuilder"

echo "🗑️  Removing old directory..."
sudo rm -rf $APP_DIR

echo "📁 Creating fresh directory..."
sudo mkdir -p /var/www
cd /var/www

echo "📥 Cloning repository..."
sudo git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
sudo chown -R ubuntu:ubuntu $APP_DIR

cd $APP_DIR

echo "📦 Installing dependencies..."
npm install

echo "📝 Setting up environment..."
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
JWT_SECRET="prod-jwt-secret-change-this-12345"
EOF

echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "👥 Creating user and assigning data..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  try {
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
    console.log('✅ User created:', user.email);
    
    const pages = await prisma.page.updateMany({ data: { customerId: user.id } });
    const stores = await prisma.store.updateMany({ data: { customerId: user.id } });
    const colors = await prisma.productColor.updateMany({ data: { customerId: user.id } });
    const media = await prisma.media.updateMany({ data: { customerId: user.id } });
    
    console.log('✅ Assigned:', pages.count, 'pages,', stores.count, 'stores,', colors.count, 'colors,', media.count, 'media');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.\$disconnect();
  }
})();
"

echo "🔨 Building application..."
npm run build

echo "🔄 Setting up PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

pm2 stop $PM2_APP_NAME 2>/dev/null || true
pm2 delete $PM2_APP_NAME 2>/dev/null || true
pm2 start npm --name $PM2_APP_NAME -- start
pm2 save

echo "✅ Done!"
ENDSSH

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              🎉 DEPLOYMENT COMPLETE!                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Visit: http://43.205.214.197:3002"
echo "🔑 Login: test@gmail.com / 12345"
echo ""
