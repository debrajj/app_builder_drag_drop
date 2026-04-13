#!/bin/bash
# Deploy app with /appbuilder base path

set -e

echo "🚀 Deploying App Builder with /appbuilder route..."

cd ~/appbuilder

# Stop existing process
echo "Stopping existing process..."
pm2 delete appbuilder 2>/dev/null || true

# Pull latest changes
echo "Pulling latest changes..."
git pull

# Update .env with BASE_PATH
echo "Updating environment variables..."
cat > .env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
PORT=3002
NODE_ENV=production
BASE_PATH=/appbuilder
DISABLE_HMR=true
EOF

# Install dependencies
echo "Installing dependencies..."
npm install

# Build with BASE_PATH
echo "Building application with base path..."
npm run build

# Start with PM2
echo "Starting application..."
pm2 start npm --name "appbuilder" -- start

# Save PM2 config
pm2 save

echo ""
echo "✅ Application deployed!"
echo ""
echo "Now run the nginx setup script:"
echo "  chmod +x setup-nginx-appbuilder.sh"
echo "  ./setup-nginx-appbuilder.sh"
