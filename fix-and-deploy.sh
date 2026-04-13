#!/bin/bash
# Complete fix and deployment script
# Run this on your EC2 server

set -e

echo "🔧 Fixing and deploying App Builder..."

# Stop any existing process
echo "Stopping existing process..."
pm2 delete appbuilder 2>/dev/null || true

# Go to app directory
cd ~/appbuilder

# Update package.json with start script
echo "Updating package.json..."
cat > package.json << 'EOF'
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "prisma db push && tsx server.ts",
    "build": "prisma generate && prisma db push && vite build",
    "start": "NODE_ENV=production tsx server.ts",
    "postinstall": "prisma generate",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@prisma/client": "^6.4.1",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "axios": "^1.14.0",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "prisma": "^6.4.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sonner": "^2.0.7",
    "vite": "^6.2.0",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
EOF

# Install dependencies
echo "Installing dependencies..."
npm install

# Build application
echo "Building application..."
npm run build

# Start with PM2
echo "Starting application..."
pm2 start npm --name "appbuilder" -- start

# Save PM2 config
pm2 save

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Check status:"
echo "  pm2 status"
echo ""
echo "View logs:"
echo "  pm2 logs appbuilder"
echo ""
echo "Test locally:"
echo "  curl http://localhost:3002"
echo ""
echo "⚠️  Don't forget to open port 3002 in AWS Security Group!"
echo "Then access: http://43.205.214.197:3002"
