#!/bin/bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 'bash -s' << 'ENDSSH'
set -e
cd /var/www/appbuilder

echo "📥 Pulling code..."
git pull

echo "📦 Installing (production only)..."
npm ci --production --ignore-scripts

echo "🔨 Building..."
NODE_ENV=production npx vite build

echo "🔄 Restarting..."
pm2 restart appbuilder

echo "✅ Done!"
pm2 status
ENDSSH
