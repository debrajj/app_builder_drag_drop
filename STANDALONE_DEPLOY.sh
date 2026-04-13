#!/bin/bash

# Standalone Deployment Script for App Builder on EC2
# This will NOT touch your existing application on port 3001

set -e  # Exit on error

echo "🚀 Starting Standalone App Builder Deployment..."

# Configuration
APP_DIR="/home/ubuntu/appbuilder"
REPO_URL="https://github.com/debrajj/app_builder_drag_drop.git"
PORT=3002

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  IMPORTANT: This is a standalone deployment${NC}"
echo -e "${YELLOW}⚠️  Your existing app on port 3001 will NOT be affected${NC}"
echo ""

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
# Create app directory in home folder (not /var/www to avoid conflicts)
mkdir -p $APP_DIR
cd $(dirname $APP_DIR)

# Clone or update repository
if [ -d "$APP_DIR/.git" ]; then
    echo "Repository exists. Pulling latest changes..."
    cd $APP_DIR
    git pull
else
    echo "Cloning repository..."
    git clone $REPO_URL appbuilder
    cd $APP_DIR
fi

echo -e "${GREEN}✓ Repository ready${NC}"

echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"
npm install

echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "${YELLOW}Step 4: Setting up environment...${NC}"
# Create .env file (NO BASE_PATH - standalone app)
cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
PORT=$PORT
NODE_ENV=production
DISABLE_HMR=true
EOF

echo -e "${GREEN}✓ Environment configured${NC}"

echo -e "${YELLOW}Step 5: Setting up database...${NC}"
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

echo -e "${GREEN}✓ Database ready${NC}"

echo -e "${YELLOW}Step 6: Building application...${NC}"
npm run build

echo -e "${GREEN}✓ Application built${NC}"

echo -e "${YELLOW}Step 7: Configuring PM2...${NC}"
# Stop existing process if running
pm2 delete appbuilder 2>/dev/null || true

# Start application with PM2
pm2 start npm --name "appbuilder" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot (only run once)
pm2 startup | tail -n 1 | bash || true

echo -e "${GREEN}✓ PM2 configured${NC}"

echo -e "${YELLOW}Step 8: Checking firewall...${NC}"
# Check if port 3002 is accessible
if command -v ufw &> /dev/null; then
    sudo ufw allow $PORT/tcp 2>/dev/null || echo "UFW not active or already configured"
fi

echo -e "${GREEN}✓ Firewall checked${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}Your app is running at:${NC}"
echo -e "  ${GREEN}http://43.205.214.197:$PORT${NC}"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "  1. Ensure port $PORT is open in AWS Security Groups"
echo "  2. Your existing app on port 3001 is untouched"
echo ""
echo "Useful commands:"
echo "  - View logs: pm2 logs appbuilder"
echo "  - Restart app: pm2 restart appbuilder"
echo "  - Stop app: pm2 stop appbuilder"
echo "  - Monitor: pm2 monit"
echo "  - Check status: pm2 status"
