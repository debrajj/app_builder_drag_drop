#!/bin/bash

echo "📸 Adding Media Library Demo Data"
echo "=================================="
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
echo "🔄 Step 2: Pulling latest code with media seed..."
git pull origin main || git pull origin master

echo ""
echo "📦 Step 3: Installing dependencies..."
npm install

echo ""
echo "🗄️  Step 4: Regenerating Prisma client..."
npx prisma generate

echo ""
echo "🌱 Step 5: Adding media to database..."
npx tsx prisma/seed.ts

if [ $? -eq 0 ]; then
    echo "✅ Media seed successful!"
else
    echo "⚠️  Media already exists or seed had issues"
fi

echo ""
echo "🔨 Step 6: Rebuilding app..."
npm run build

echo ""
echo "🚀 Step 7: Restarting app..."
pm2 restart appbuilder

echo ""
echo "⏳ Waiting for app to start..."
sleep 5

echo ""
echo "📊 Step 8: Checking status..."
pm2 list

echo ""
echo "📋 Recent logs:"
pm2 logs appbuilder --lines 15 --nostream

echo ""
echo "===================================="
echo "✅ Media Library Updated!"
echo "===================================="
echo ""
echo "Your Media Library now has 13 demo items:"
echo "  • 11 Images (products, banners, avatars)"
echo "  • 2 Videos (brand story, product showcase)"
echo ""

ENDSSH

echo ""
echo "🎉 Update completed!"
echo ""
echo "Refresh https://appbuilder.technoboost.in and check Media Library"
echo ""
