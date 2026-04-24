#!/bin/bash

echo "🚀 Fixing 502 Error on appbuilder.technoboost.in"
echo "================================================"
echo ""

SSH_KEY="/Users/debrajroy/Downloads/multi-vender.pem"
SERVER="ubuntu@43.205.214.197"

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH key not found at: $SSH_KEY"
    echo "Please update the SSH_KEY variable in this script"
    exit 1
fi

echo "📡 Connecting to server..."
echo ""

# Execute fix commands on remote server
ssh -i "$SSH_KEY" "$SERVER" << 'ENDSSH'

echo "🔍 Step 1: Finding app directory..."
if [ -d "/var/www/appbuilder" ]; then
    APP_DIR="/var/www/appbuilder"
elif [ -d "/home/ubuntu/appbuilder" ]; then
    APP_DIR="/home/ubuntu/appbuilder"
else
    echo "❌ App directory not found!"
    echo "Checking available directories..."
    ls -la /var/www/
    ls -la /home/ubuntu/
    exit 1
fi

echo "✓ Found: $APP_DIR"
cd "$APP_DIR"

echo ""
echo "🛑 Step 2: Stopping existing process..."
pm2 stop appbuilder 2>/dev/null || echo "No process running"
pm2 delete appbuilder 2>/dev/null || echo "No process to delete"

echo ""
echo "📝 Step 3: Checking .env file..."
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
DISABLE_HMR=true
EOF
fi
cat .env

echo ""
echo "🔄 Step 4: Pulling latest code..."
git pull origin main || git pull origin master || echo "No git updates"

echo ""
echo "📦 Step 5: Installing dependencies..."
npm install

echo ""
echo "🗄️  Step 6: Setting up database..."
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed

echo ""
echo "🔨 Step 7: Building application..."
npm run build

echo ""
echo "🚀 Step 8: Starting with PM2..."
pm2 start npm --name "appbuilder" -- start
pm2 save

echo ""
echo "⏳ Waiting for app to start..."
sleep 5

echo ""
echo "✅ Step 9: Checking status..."
pm2 list

echo ""
echo "🧪 Step 10: Testing local connection..."
curl -I http://localhost:3002 2>/dev/null | head -n 1 || echo "❌ Not responding yet"

echo ""
echo "📋 Recent logs:"
pm2 logs appbuilder --lines 20 --nostream

echo ""
echo "🌐 Step 11: Checking nginx..."
sudo systemctl status nginx --no-pager | head -n 5
sudo nginx -t

echo ""
echo "🔥 Step 12: Checking firewall..."
sudo ufw status | grep 3002 || sudo ufw allow 3002/tcp

echo ""
echo "================================================"
echo "✅ Fix completed!"
echo "================================================"
echo ""
echo "App should be accessible at:"
echo "  • https://appbuilder.technoboost.in"
echo "  • http://43.205.214.197:3002"
echo ""

ENDSSH

echo ""
echo "🎉 Remote fix script completed!"
echo ""
echo "Testing the URL..."
sleep 2
curl -I https://appbuilder.technoboost.in 2>/dev/null | head -n 1

echo ""
echo "If still showing 502, run: ssh -i $SSH_KEY $SERVER 'pm2 logs appbuilder'"
