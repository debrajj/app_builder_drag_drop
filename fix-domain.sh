#!/bin/bash

# Fix domain configuration for HTTPS
set -e

SERVER_IP="43.205.214.197"
SSH_KEY="/Users/debrajroy/Downloads/multi-vender.pem"
SERVER_USER="ubuntu"

echo "🔧 Fixing domain configuration for HTTPS..."
echo ""

ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" bash << 'ENDSSH'
set -e

APP_DIR="/var/www/appbuilder"
cd $APP_DIR

echo "📝 Updating environment configuration..."
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
JWT_SECRET="prod-jwt-secret-change-this-12345"
EOF

echo "🔨 Rebuilding application with new configuration..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart appbuilder

echo "✅ Configuration updated!"
ENDSSH

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅ DOMAIN CONFIGURATION FIXED!                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Your app should now work at:"
echo "   https://appbuilder.technoboost.in"
echo ""
echo "🔑 Login: test@gmail.com / 12345"
echo ""
