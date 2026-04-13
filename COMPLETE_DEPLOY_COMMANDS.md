# Complete Deployment Commands for EC2

Copy and paste these commands one by one into your EC2 terminal.

## Step 1: Connect to EC2
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

## Step 2: Stop any existing failed process
```bash
pm2 delete appbuilder 2>/dev/null || true
```

## Step 3: Go to app directory (if not already there)
```bash
cd ~/appbuilder
```

## Step 4: Pull latest changes (includes the start script fix)
```bash
git pull origin main
```

If git pull doesn't work, manually update package.json:
```bash
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
```

## Step 5: Install/update dependencies
```bash
npm install
```

## Step 6: Build the application
```bash
npm run build
```

## Step 7: Start with PM2
```bash
pm2 start npm --name "appbuilder" -- start
```

## Step 8: Save PM2 configuration
```bash
pm2 save
```

## Step 9: Check if it's running
```bash
pm2 status
pm2 logs appbuilder --lines 20
```

## Step 10: Test locally on server
```bash
curl http://localhost:3002
```

If you see HTML output, the app is working!

## Step 11: Open port 3002 in AWS Security Group

**Go to AWS Console:**
1. Navigate to: https://console.aws.amazon.com/ec2/
2. Click "Instances" in left sidebar
3. Find instance with IP 43.205.214.197
4. Click on it
5. Go to "Security" tab
6. Click on the Security Group link (sg-xxxxx)
7. Click "Edit inbound rules"
8. Click "Add rule"
9. Set:
   - Type: Custom TCP
   - Port: 3002
   - Source: 0.0.0.0/0
   - Description: App Builder
10. Click "Save rules"

## Step 12: Access your app
```
http://43.205.214.197:3002
```

---

## Troubleshooting

### If app still shows as errored:
```bash
pm2 delete appbuilder
pm2 start npm --name "appbuilder" -- start
pm2 logs appbuilder
```

### If you see "Missing script: start":
The package.json wasn't updated. Run Step 4 again (the manual package.json update).

### If port 3002 doesn't respond:
Make sure AWS Security Group has port 3002 open (Step 11).

### Check what's listening on port 3002:
```bash
sudo ss -tulpn | grep 3002
```

---

## Quick Commands Reference

```bash
# View status
pm2 status

# View logs
pm2 logs appbuilder

# Restart app
pm2 restart appbuilder

# Stop app
pm2 stop appbuilder

# Monitor
pm2 monit
```
