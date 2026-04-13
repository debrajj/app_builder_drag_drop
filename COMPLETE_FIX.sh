#!/bin/bash
# Complete fix - ensure app is running and nginx routes correctly

set -e

echo "🔧 Complete Fix for /appbuilder Route"
echo "======================================"
echo ""

# Step 1: Check if app is running on port 3002
echo "1️⃣ Checking if app is running on port 3002..."
if sudo ss -tulpn | grep -q ":3002"; then
    echo "✅ App is running on port 3002"
else
    echo "⚠️  App not running on port 3002, starting it..."
    cd ~/appbuilder
    pm2 delete appbuilder 2>/dev/null || true
    pm2 start npm --name "appbuilder" -- start
    pm2 save
    sleep 3
fi

# Step 2: Test app locally
echo ""
echo "2️⃣ Testing app on localhost:3002..."
RESPONSE=$(curl -s http://localhost:3002)
if echo "$RESPONSE" | grep -q "html"; then
    echo "✅ App responds correctly on port 3002"
else
    echo "❌ App not responding correctly"
    echo "Response: $RESPONSE"
    echo "Check logs: pm2 logs appbuilder"
    exit 1
fi

# Step 3: Fix nginx configuration
echo ""
echo "3️⃣ Fixing nginx configuration..."

# Backup current config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# Create correct nginx configuration
sudo tee /etc/nginx/sites-available/default > /dev/null << 'NGINX_CONFIG'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    # App Builder on port 3002 - MUST come before / location
    location /appbuilder/ {
        proxy_pass http://localhost:3002/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Redirect /appbuilder to /appbuilder/
    location = /appbuilder {
        return 301 /appbuilder/;
    }

    # Marketplace on port 3001 - catch-all
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_CONFIG

# Step 4: Test nginx configuration
echo ""
echo "4️⃣ Testing nginx configuration..."
sudo nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Step 5: Reload nginx
echo ""
echo "5️⃣ Reloading nginx..."
sudo systemctl reload nginx

# Step 6: Test the routing
echo ""
echo "6️⃣ Testing routing..."
echo ""
echo "Testing marketplace (/):"
if curl -s http://localhost/ | grep -q "TechnoBoost"; then
    echo "✅ Marketplace works on /"
else
    echo "⚠️  Marketplace response unexpected"
fi

echo ""
echo "Testing app builder (/appbuilder/):"
APPBUILDER_RESPONSE=$(curl -s http://localhost/appbuilder/)
if echo "$APPBUILDER_RESPONSE" | grep -q "html"; then
    echo "✅ App Builder works on /appbuilder/"
else
    echo "❌ App Builder not working on /appbuilder/"
    echo "Response preview: ${APPBUILDER_RESPONSE:0:200}"
    echo "Checking headers..."
    curl -I http://localhost/appbuilder/
fi

echo ""
echo "======================================"
echo "✅ Fix Complete!"
echo "======================================"
echo ""
echo "Access your apps:"
echo "  Marketplace: https://wormlike-loren-harmoniously.ngrok-free.dev/"
echo "  App Builder: https://wormlike-loren-harmoniously.ngrok-free.dev/appbuilder/"
echo ""
echo "Debug commands:"
echo "  pm2 status"
echo "  pm2 logs appbuilder"
echo "  sudo nginx -t"
echo "  curl http://localhost:3002"
echo "  curl http://localhost/appbuilder/"
