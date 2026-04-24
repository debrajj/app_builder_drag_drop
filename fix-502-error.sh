#!/bin/bash

echo "🚀 App Builder 502 Error Fix Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Find app directory
APP_DIR=""
if [ -d "/var/www/appbuilder" ]; then
    APP_DIR="/var/www/appbuilder"
elif [ -d "/home/ubuntu/appbuilder" ]; then
    APP_DIR="/home/ubuntu/appbuilder"
elif [ -d "~/appbuilder" ]; then
    APP_DIR="~/appbuilder"
else
    echo -e "${RED}❌ Cannot find appbuilder directory${NC}"
    echo "Please run this script from the appbuilder directory or specify the path"
    exit 1
fi

echo -e "${GREEN}✓ Found app directory: $APP_DIR${NC}"
cd "$APP_DIR"

# Step 1: Check current status
echo ""
echo "📊 Step 1: Checking current status..."
echo "------------------------------------"
pm2 list | grep appbuilder
PORT_CHECK=$(sudo netstat -tulpn | grep 3002 || echo "Port 3002 not in use")
echo "$PORT_CHECK"

# Step 2: Stop existing process
echo ""
echo "🛑 Step 2: Stopping existing process..."
echo "------------------------------------"
pm2 stop appbuilder 2>/dev/null || echo "No process to stop"
pm2 delete appbuilder 2>/dev/null || echo "No process to delete"

# Step 3: Check environment file
echo ""
echo "📝 Step 3: Checking environment configuration..."
echo "------------------------------------"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ Creating .env file${NC}"
    cat > .env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
DISABLE_HMR=true
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Step 4: Install dependencies
echo ""
echo "📦 Step 4: Installing dependencies..."
echo "------------------------------------"
npm install

# Step 5: Setup database
echo ""
echo "🗄️  Step 5: Setting up database..."
echo "------------------------------------"
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed

# Step 6: Build application
echo ""
echo "🔨 Step 6: Building application..."
echo "------------------------------------"
npm run build

# Step 7: Start with PM2
echo ""
echo "🚀 Step 7: Starting application with PM2..."
echo "------------------------------------"
pm2 start npm --name "appbuilder" -- start
pm2 save

# Step 8: Check nginx configuration
echo ""
echo "🌐 Step 8: Checking nginx configuration..."
echo "------------------------------------"
if [ -f "/etc/nginx/sites-available/appbuilder" ]; then
    echo -e "${GREEN}✓ Nginx config exists${NC}"
    sudo nginx -t
    sudo systemctl reload nginx
else
    echo -e "${YELLOW}⚠ No nginx config found. Creating one...${NC}"
    sudo tee /etc/nginx/sites-available/appbuilder > /dev/null << 'EOF'
server {
    listen 80;
    server_name appbuilder.technoboost.in;

    location / {
        proxy_pass http://localhost:3002;
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
EOF
    
    sudo ln -sf /etc/nginx/sites-available/appbuilder /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    echo -e "${GREEN}✓ Nginx configured${NC}"
fi

# Step 9: Check firewall
echo ""
echo "🔥 Step 9: Checking firewall..."
echo "------------------------------------"
sudo ufw status | grep 3002 || sudo ufw allow 3002/tcp

# Step 10: Verify everything is running
echo ""
echo "✅ Step 10: Verification..."
echo "------------------------------------"
sleep 3
pm2 list
echo ""
echo "Testing local connection..."
curl -s http://localhost:3002 > /dev/null && echo -e "${GREEN}✓ Backend responding on port 3002${NC}" || echo -e "${RED}❌ Backend not responding${NC}"

# Show logs
echo ""
echo "📋 Recent logs:"
echo "------------------------------------"
pm2 logs appbuilder --lines 15 --nostream

echo ""
echo "===================================="
echo -e "${GREEN}🎉 Fix script completed!${NC}"
echo "===================================="
echo ""
echo "Your app should now be accessible at:"
echo "  • http://43.205.214.197:3002"
echo "  • https://appbuilder.technoboost.in"
echo ""
echo "To monitor logs: pm2 logs appbuilder"
echo "To restart: pm2 restart appbuilder"
echo ""
