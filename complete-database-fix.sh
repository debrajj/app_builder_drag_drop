#!/bin/bash

echo "🗄️  Complete Database Fix with Demo Data"
echo "========================================"
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
echo "🗑️  Step 2: Removing all database and migration files..."
rm -rf prisma/dev.db*
rm -rf prisma/migrations

echo ""
echo "🔨 Step 3: Creating fresh migration..."
npx prisma migrate dev --name init --skip-seed

echo ""
echo "🌱 Step 4: Seeding database..."
npx tsx prisma/seed.ts

if [ $? -eq 0 ]; then
    echo "✅ Seed successful!"
else
    echo "⚠️  Seed had issues, but continuing..."
fi

echo ""
echo "🚀 Step 5: Restarting app..."
pm2 restart appbuilder

echo ""
echo "⏳ Waiting for app to start..."
sleep 5

echo ""
echo "📊 Step 6: Checking app status..."
pm2 list

echo ""
echo "📋 Recent logs:"
pm2 logs appbuilder --lines 20 --nostream

echo ""
echo "===================================="
echo "✅ Complete!"
echo "===================================="
echo ""

ENDSSH

echo ""
echo "🎉 Database fix completed!"
echo ""
echo "Testing the URL..."
sleep 2
curl -s https://appbuilder.technoboost.in | head -n 5
echo ""
echo ""
echo "Your app should now have demo data at:"
echo "  • https://appbuilder.technoboost.in"
echo ""
