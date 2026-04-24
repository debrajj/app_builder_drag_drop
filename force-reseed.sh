#!/bin/bash

echo "🗄️  Force Resetting Database with Demo Data"
echo "==========================================="
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
echo "🗑️  Step 2: Force deleting database files..."
rm -f prisma/dev.db
rm -f prisma/dev.db-journal
rm -f prisma/dev.db-shm
rm -f prisma/dev.db-wal
ls -la prisma/ | grep dev.db

echo ""
echo "🔨 Step 3: Resetting database with migrations..."
npx prisma migrate reset --force --skip-seed

echo ""
echo "🌱 Step 4: Running seed manually..."
npx tsx prisma/seed.ts

echo ""
echo "🚀 Step 5: Restarting app..."
pm2 restart appbuilder

echo ""
echo "⏳ Waiting for app to start..."
sleep 5

echo ""
echo "✅ Step 6: Verifying data..."
echo "Checking pages in database..."
sqlite3 prisma/dev.db "SELECT COUNT(*) as page_count FROM Page;"
echo ""
echo "Checking stores in database..."
sqlite3 prisma/dev.db "SELECT COUNT(*) as store_count FROM Store;"

echo ""
echo "📋 App logs:"
pm2 logs appbuilder --lines 10 --nostream

echo ""
echo "===================================="
echo "✅ Database reset complete!"
echo "===================================="
echo ""

ENDSSH

echo ""
echo "🎉 Force reseed completed!"
echo ""
echo "Your demo data should now be visible at:"
echo "  • https://appbuilder.technoboost.in"
echo ""
