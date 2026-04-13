#!/bin/bash

# Deployment script for App Builder on EC2
# Run this script on your EC2 instance

set -e  # Exit on error

echo "🚀 Starting App Builder Deployment..."

# Configuration
APP_DIR="/var/www/appbuilder"
REPO_URL="https://github.com/debrajj/app_builder_drag_drop.git"
PORT=3002
BASE_PATH="/appbuilder"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"
# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing..."
    sudo npm install -g pm2
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"

echo -e "${YELLOW}Step 2: Cloning repository...${NC}"
# Create app directory if it doesn't exist
sudo mkdir -p $APP_DIR
cd /var/www

# Clone or update repository
if [ -d "$APP_DIR/.git" ]; then
    echo "Repository exists. Pulling latest changes..."
    cd $APP_DIR
    git pull
else
    echo "Cloning repository..."
    sudo git clone $REPO_URL appbuilder
    cd $APP_DIR
fi

echo -e "${GREEN}✓ Repository ready${NC}"

echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"
npm install

echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "${YELLOW}Step 4: Setting up environment...${NC}"
# Create .env file
cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
PORT=$PORT
NODE_ENV=production
BASE_PATH=$BASE_PATH
DISABLE_HMR=true
EOF

echo -e "${GREEN}✓ Environment configured${NC}"

echo -e "${YELLOW}Step 5: Replacing server.ts with BASE_PATH support...${NC}"
# Backup original server.ts
cp server.ts server.ts.backup

# Copy the updated server file
if [ -f "server-with-basepath.ts" ]; then
    cp server-with-basepath.ts server.ts
    echo -e "${GREEN}✓ Server updated with BASE_PATH support${NC}"
else
    echo -e "${YELLOW}⚠ server-with-basepath.ts not found, using original${NC}"
fi

echo -e "${YELLOW}Step 6: Setting up database...${NC}"
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

echo -e "${GREEN}✓ Database ready${NC}"

echo -e "${YELLOW}Step 7: Building application...${NC}"
npm run build

echo -e "${GREEN}✓ Application built${NC}"

echo -e "${YELLOW}Step 8: Configuring PM2...${NC}"
# Stop existing process if running
pm2 delete appbuilder 2>/dev/null || true

# Start application with PM2
pm2 start npm --name "appbuilder" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot (only run once)
pm2 startup | tail -n 1 | sudo bash || true

echo -e "${GREEN}✓ PM2 configured${NC}"

echo -e "${YELLOW}Step 9: Configuring Nginx...${NC}"
# Create nginx configuration
sudo tee /etc/nginx/sites-available/appbuilder.conf > /dev/null << 'NGINX_EOF'
# Add this location block to your existing server block
location /appbuilder {
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
NGINX_EOF

echo -e "${GREEN}✓ Nginx configuration created${NC}"
echo -e "${YELLOW}⚠ Please manually add the location block from /etc/nginx/sites-available/appbuilder.conf to your main nginx config${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Application is running on:"
echo "  - Local: http://localhost:$PORT"
echo "  - Public: http://43.205.214.197:3001/appbuilder"
echo ""
echo "Next steps:"
echo "  1. Add the nginx location block to your main config"
echo "  2. Test nginx config: sudo nginx -t"
echo "  3. Reload nginx: sudo systemctl reload nginx"
echo "  4. Check logs: pm2 logs appbuilder"
echo ""
echo "Useful commands:"
echo "  - View logs: pm2 logs appbuilder"
echo "  - Restart app: pm2 restart appbuilder"
echo "  - Stop app: pm2 stop appbuilder"
echo "  - Monitor: pm2 monit"
