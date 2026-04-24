#!/bin/bash

echo "🔍 Checking App Builder Status..."
echo "=================================="

# Check if PM2 is running the app
echo ""
echo "1. Checking PM2 processes..."
pm2 list

# Check if port 3002 is in use
echo ""
echo "2. Checking port 3002..."
sudo netstat -tulpn | grep 3002

# Check nginx status
echo ""
echo "3. Checking nginx status..."
sudo systemctl status nginx --no-pager

# Check nginx configuration for appbuilder
echo ""
echo "4. Checking nginx configuration..."
if [ -f /etc/nginx/sites-available/appbuilder ]; then
    echo "Found nginx config for appbuilder"
    cat /etc/nginx/sites-available/appbuilder
else
    echo "No nginx config found for appbuilder"
fi

echo ""
echo "=================================="
echo "🔧 Attempting to restart..."
echo "=================================="

# Navigate to app directory
cd /var/www/appbuilder || cd ~/appbuilder || cd /home/ubuntu/appbuilder

# Restart with PM2
echo ""
echo "Restarting PM2 process..."
pm2 restart appbuilder || pm2 start npm --name "appbuilder" -- start

# Show logs
echo ""
echo "📋 Recent logs:"
pm2 logs appbuilder --lines 20 --nostream

echo ""
echo "✅ Done! Check if app is running at http://43.205.214.197:3002"
