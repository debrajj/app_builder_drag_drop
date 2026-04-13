#!/bin/bash
# Complete setup script - runs everything in one go

set -e

echo "🚀 Complete App Builder Setup with /appbuilder route"
echo "=================================================="
echo ""

# Go to app directory
cd ~/appbuilder

# Stop existing process
echo "1️⃣ Stopping existing process..."
pm2 delete appbuilder 2>/dev/null || true

# Pull latest changes
echo "2️⃣ Pulling latest changes..."
git pull

# Update .env with BASE_PATH
echo "3️⃣ Configuring environment..."
cat > .env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
PORT=3002
NODE_ENV=production
BASE_PATH=/appbuilder
DISABLE_HMR=true
EOF

# Install dependencies
echo "4️⃣ Installing dependencies..."
npm install

# Build with BASE_PATH
echo "5️⃣ Building application..."
npm run build

# Start with PM2
echo "6️⃣ Starting application..."
pm2 start npm --name "appbuilder" -- start
pm2 save

# Setup nginx
echo "7️⃣ Configuring nginx..."

# Backup existing nginx config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Create new nginx configuration
sudo tee /etc/nginx/sites-available/default > /dev/null << 'NGINX_CONFIG'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    # Existing app on port 3001
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

    # App Builder on port 3002 with /appbuilder route
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
    
    location = /appbuilder {
        return 301 /appbuilder/;
    }
}
NGINX_CONFIG

# Test nginx configuration
echo "8️⃣ Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "9️⃣ Reloading nginx..."
    sudo systemctl reload nginx
    
    echo ""
    echo "=================================================="
    echo "✅ Setup Complete!"
    echo "=================================================="
    echo ""
    echo "Your apps are now accessible at:"
    echo ""
    echo "  Main app:"
    echo "    - http://43.205.214.197:3001"
    echo "    - https://wormlike-loren-harmoniously.ngrok-free.dev"
    echo ""
    echo "  App Builder:"
    echo "    - http://43.205.214.197:3001/appbuilder"
    echo "    - https://wormlike-loren-harmoniously.ngrok-free.dev/appbuilder"
    echo ""
    echo "Useful commands:"
    echo "  - Check status: pm2 status"
    echo "  - View logs: pm2 logs appbuilder"
    echo "  - Restart: pm2 restart appbuilder"
    echo ""
else
    echo "❌ Nginx configuration test failed"
    echo "Please check the nginx configuration manually"
    exit 1
fi
