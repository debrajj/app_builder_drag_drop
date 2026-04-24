#!/bin/bash

echo "🗄️  Resetting and Reseeding Database"
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
echo "🗑️  Step 2: Deleting old database..."
rm -f prisma/dev.db prisma/dev.db-journal

echo ""
echo "🔨 Step 3: Creating fresh database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo ""
echo "🌱 Step 4: Seeding with demo data..."
npx prisma db seed

echo ""
echo "🚀 Step 5: Restarting app..."
pm2 restart appbuilder

echo ""
echo "⏳ Waiting for app to start..."
sleep 3

echo ""
echo "✅ Step 6: Checking status..."
pm2 list

echo ""
echo "📋 Recent logs:"
pm2 logs appbuilder --lines 15 --nostream

echo ""
echo "===================================="
echo "✅ Database reset complete!"
echo "===================================="
echo ""
echo "Your demo data should now be visible at:"
echo "  • https://appbuilder.technoboost.in"
echo ""

ENDSSH

echo ""
echo "🎉 Reseed completed!"
echo ""
echo "Testing the URL..."
sleep 2
curl -I https://appbuilder.technoboost.in 2>/dev/null | head -n 1
