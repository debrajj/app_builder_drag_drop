#!/bin/bash

echo "🔒 Fixing HTTPS Mixed Content Issue"
echo "===================================="
echo ""

SSH_KEY="/Users/debrajroy/Downloads/multi-vender.pem"
SERVER="ubuntu@43.205.214.197"

# Execute on remote server
ssh -i "$SSH_KEY" "$SERVER" << 'ENDSSH'

# Find app directory
if [ -d "/home/ubuntu/appbuilder" ]; then
    APP_DIR="/home/ubuntu/appbuilder"
elif [ -d "/var/www/appbuilder" ]; then
    APP_DIR="/var/www/appbuilder"
else
    echo "❌ App directory not found!"
    exit 1
fi

echo "📂 Working in: $APP_DIR"
cd "$APP_DIR"

echo ""
echo "🛑 Step 1: Stopping app..."
pm2 stop appbuilder

echo ""
echo "📝 Step 2: Updating .env to use HTTPS domain..."
cat > .env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=*
DISABLE_HMR=true
EOF

echo "Updated .env file:"
cat .env

echo ""
echo "🔨 Step 3: Rebuilding with new API URL..."
npm run build

echo ""
echo "🚀 Step 4: Restarting app..."
pm2 restart appbuilder

echo ""
echo "⏳ Waiting for app to start..."
sleep 5

echo ""
echo "📊 Step 5: Checking status..."
pm2 list

echo ""
echo "📋 Recent logs:"
pm2 logs appbuilder --lines 15 --nostream

echo ""
echo "===================================="
echo "✅ HTTPS fix complete!"
echo "===================================="
echo ""
echo "The app now uses HTTPS for API calls:"
echo "  • Frontend: https://appbuilder.technoboost.in"
echo "  • API: https://appbuilder.technoboost.in/api/*"
echo ""

ENDSSH

echo ""
echo "🎉 Fix completed!"
echo ""
echo "Testing the URL..."
sleep 2
curl -I https://appbuilder.technoboost.in 2>/dev/null | head -n 1
echo ""
echo "Please refresh your browser and clear cache (Cmd+Shift+R on Mac)"
echo ""
