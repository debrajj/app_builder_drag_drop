#!/bin/bash

# Deployment Script for App Builder with Authentication
# Target: EC2 Server at 43.205.214.197:3002

set -e  # Exit on any error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║         🚀 DEPLOYING APP BUILDER TO SERVER                ║"
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

echo "📋 Deployment Configuration:"
echo "   Server: $SERVER_IP"
echo "   Port: $PORT"
echo "   Directory: $APP_DIR"
echo "   PM2 Name: $PM2_APP_NAME"
echo ""

# Step 1: Build locally
echo "🔨 Step 1: Building application locally..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 2: Create deployment package
echo "📦 Step 2: Creating deployment package..."
tar -czf deploy.tar.gz \
    dist/ \
    server.ts \
    auth-middleware.ts \
    package.json \
    package-lock.json \
    prisma/ \
    .env.production \
    tsconfig.json

echo "✅ Package created: deploy.tar.gz"
echo ""

# Step 3: Upload to server
echo "📤 Step 3: Uploading to server..."
scp -i "$SSH_KEY" deploy.tar.gz "$SERVER_USER@$SERVER_IP:/tmp/"
if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    exit 1
fi
echo "✅ Upload successful"
echo ""

# Step 4: Deploy on server
echo "🚀 Step 4: Deploying on server..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

APP_DIR="/var/www/appbuilder"
PM2_APP_NAME="appbuilder"

echo "   📁 Creating/updating app directory..."
sudo mkdir -p $APP_DIR
sudo chown -R ubuntu:ubuntu $APP_DIR

echo "   📦 Extracting package..."
cd $APP_DIR
tar -xzf /tmp/deploy.tar.gz
rm /tmp/deploy.tar.gz

echo "   📝 Setting up environment..."
cp .env.production .env

# Update DATABASE_URL to use PostgreSQL
cat > .env << 'EOF'
# Production Environment Variables
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
JWT_SECRET="production-jwt-secret-change-this-to-random-string-12345"
EOF

echo "   📦 Installing dependencies..."
npm install --production

echo "   🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo "   👥 Creating test user..."
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

echo "   🔄 Managing PM2 process..."
# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "   📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Stop existing process if running
pm2 stop $PM2_APP_NAME 2>/dev/null || true
pm2 delete $PM2_APP_NAME 2>/dev/null || true

# Start new process
pm2 start server.ts --name $PM2_APP_NAME --interpreter tsx

# Save PM2 configuration
pm2 save

# Setup PM2 startup (only if not already set)
pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true

echo "   ✅ Deployment complete!"
ENDSSH

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""

# Step 5: Verify deployment
echo "🔍 Step 5: Verifying deployment..."
sleep 3

# Check if server is responding
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_IP:$PORT/api/pages" -H "Authorization: Bearer test" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    echo "✅ Server is running and authentication is working!"
elif [ "$HTTP_CODE" = "200" ]; then
    echo "⚠️  Server is running but authentication might not be enforced"
else
    echo "⚠️  Server might still be starting (HTTP $HTTP_CODE)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║              🎉 DEPLOYMENT COMPLETE!                       ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Your application is now live at:"
echo "   http://$SERVER_IP:$PORT"
echo ""
echo "🔑 Login Credentials:"
echo "   Email: test@gmail.com"
echo "   Password: 12345"
echo ""
echo "📊 Useful Commands:"
echo "   View logs:    ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs $PM2_APP_NAME'"
echo "   Restart app:  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 restart $PM2_APP_NAME'"
echo "   Stop app:     ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 stop $PM2_APP_NAME'"
echo ""

# Cleanup
rm -f deploy.tar.gz

echo "🧹 Cleanup complete"
echo ""
echo "✨ Done! Visit http://$SERVER_IP:$PORT to see your app"
