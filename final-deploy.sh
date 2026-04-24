#!/bin/bash

# Final deployment script - handles everything
set -e

SERVER_IP="43.205.214.197"
SSH_KEY="/Users/debrajroy/Downloads/multi-vender.pem"
SERVER_USER="ubuntu"
APP_DIR="/var/www/appbuilder"
PM2_APP_NAME="appbuilder"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🚀 FINAL DEPLOYMENT TO SERVER                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Ensure latest code is on GitHub
echo "📝 Step 1: Pushing to GitHub..."
git add .
git commit -m "Deploy with authentication and landing page" || echo "No new changes"
git push origin main || git push origin master
echo "✅ Code pushed to GitHub"
echo ""

# Step 2: Deploy on server
echo "🚀 Step 2: Deploying on server..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" bash << 'ENDSSH'
set -e

APP_DIR="/var/www/appbuilder"
PM2_APP_NAME="appbuilder"

echo "   📁 Setting up directory..."
if [ ! -d "$APP_DIR" ]; then
    echo "   Creating new directory and cloning..."
    sudo mkdir -p /var/www
    cd /var/www
    sudo git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
    sudo chown -R ubuntu:ubuntu $APP_DIR
fi

cd $APP_DIR

echo "   📥 Pulling latest code..."
git fetch --all
git reset --hard origin/main || git reset --hard origin/master

echo "   📦 Installing dependencies..."
npm install

echo "   📝 Configuring environment..."
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
JWT_SECRET="prod-jwt-secret-change-this-12345"
EOF

echo "   🗄️  Setting up database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "   👥 Setting up user..."
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
    console.log('   ✅ User:', user.email);
    
    await prisma.page.updateMany({ data: { customerId: user.id } });
    await prisma.store.updateMany({ data: { customerId: user.id } });
    await prisma.productColor.updateMany({ data: { customerId: user.id } });
    await prisma.media.updateMany({ data: { customerId: user.id } });
    console.log('   ✅ Data assigned to user');
  } catch (e) {
    console.error('   ❌ Error:', e.message);
  } finally {
    await prisma.\$disconnect();
  }
})();
"

echo "   🔨 Building application..."
npm run build

echo "   🔄 Setting up PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

pm2 stop $PM2_APP_NAME 2>/dev/null || true
pm2 delete $PM2_APP_NAME 2>/dev/null || true
pm2 start npm --name $PM2_APP_NAME -- start
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true

echo "   ✅ Deployment complete!"
ENDSSH

echo ""
echo "✅ Deployment successful!"
echo ""

# Step 3: Verify
echo "🔍 Step 3: Verifying deployment..."
sleep 5

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_IP:3002" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Server is responding!"
else
    echo "⚠️  Server returned HTTP $HTTP_CODE (might still be starting)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              🎉 DEPLOYMENT COMPLETE!                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Application URL:"
echo "   http://43.205.214.197:3002"
echo ""
echo "🔑 Login Credentials:"
echo "   Email: test@gmail.com"
echo "   Password: 12345"
echo ""
echo "📊 Useful Commands:"
echo "   Check logs:   ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs $PM2_APP_NAME'"
echo "   Restart:      ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 restart $PM2_APP_NAME'"
echo "   Status:       ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 status'"
echo ""
