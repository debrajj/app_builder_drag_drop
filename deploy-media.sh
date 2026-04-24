#!/bin/bash

echo "📸 Deploying Media Library Items"
echo "================================="
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
echo "🔄 Step 1: Pulling latest code..."
git pull origin main || git pull origin master

echo ""
echo "📦 Step 2: Installing dependencies..."
npm install

echo ""
echo "🗄️  Step 3: Generating Prisma client..."
npx prisma generate

echo ""
echo "📸 Step 4: Adding media items to database..."
npx tsx add-media-only.ts

echo ""
echo "===================================="
echo "✅ Media Library populated!"
echo "===================================="
echo ""

ENDSSH

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "Your Media Library now has demo images and videos."
echo "Refresh https://appbuilder.technoboost.in to see them!"
echo ""
