# Standalone Deployment - Quick Start

## ⚠️ Important
This is a STANDALONE deployment. Your existing app on port 3001 will NOT be affected.

---

## Quick Deploy (Automated)

### 1. Connect to EC2
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

### 2. Run Deployment Script
```bash
# Clone the repository
git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
cd appbuilder

# Make script executable and run
chmod +x STANDALONE_DEPLOY.sh
./STANDALONE_DEPLOY.sh
```

### 3. Open Port in AWS Security Group
1. Go to AWS Console → EC2 → Security Groups
2. Find your instance's security group
3. Add Inbound Rule:
   - Type: Custom TCP
   - Port: 3002
   - Source: 0.0.0.0/0 (or your specific IP)

### 4. Access Your App
```
http://43.205.214.197:3002
```

---

## Manual Deployment

### 1. Connect to EC2
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

### 2. Clone Repository
```bash
cd ~
git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
cd appbuilder
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Create Environment File
```bash
cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
PORT=3002
NODE_ENV=production
DISABLE_HMR=true
EOF
```

### 5. Setup Database
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 6. Build Application
```bash
npm run build
```

### 7. Start with PM2
```bash
# Install PM2 if not installed
sudo npm install -g pm2

# Start application
pm2 start npm --name "appbuilder" -- start

# Save PM2 config
pm2 save

# Setup startup script
pm2 startup
# Run the command that PM2 outputs
```

### 8. Open Firewall Port
```bash
# If using UFW
sudo ufw allow 3002/tcp

# Also ensure AWS Security Group allows port 3002
```

### 9. Access Your App
```
http://43.205.214.197:3002
```

---

## Verify Deployment

### Check if app is running
```bash
pm2 status
```

### Check logs
```bash
pm2 logs appbuilder
```

### Test locally on server
```bash
curl http://localhost:3002
```

### Check port
```bash
sudo netstat -tulpn | grep 3002
```

---

## AWS Security Group Configuration

1. Go to AWS Console
2. Navigate to EC2 → Instances
3. Select your instance (43.205.214.197)
4. Click on Security tab
5. Click on the Security Group link
6. Click "Edit inbound rules"
7. Click "Add rule"
8. Configure:
   - Type: Custom TCP
   - Port range: 3002
   - Source: 0.0.0.0/0 (or your IP for security)
   - Description: App Builder
9. Click "Save rules"

---

## Troubleshooting

### App not accessible from browser
1. Check if app is running: `pm2 status`
2. Check if port is listening: `sudo netstat -tulpn | grep 3002`
3. Check AWS Security Group has port 3002 open
4. Check logs: `pm2 logs appbuilder`

### Port already in use
```bash
# Find what's using port 3002
sudo lsof -i :3002

# Kill the process if needed
sudo kill -9 <PID>
```

### Database errors
```bash
cd ~/appbuilder
rm -rf prisma/dev.db
npx prisma migrate deploy
npx prisma db seed
pm2 restart appbuilder
```

### App crashes on startup
```bash
# Check detailed logs
pm2 logs appbuilder --lines 100

# Check if all dependencies installed
cd ~/appbuilder
npm install

# Rebuild
npm run build
pm2 restart appbuilder
```

---

## Update Application

```bash
cd ~/appbuilder
git pull
npm install
npm run build
pm2 restart appbuilder
```

---

## Useful PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs appbuilder

# Monitor resources
pm2 monit

# Restart app
pm2 restart appbuilder

# Stop app
pm2 stop appbuilder

# Delete from PM2
pm2 delete appbuilder

# Save current PM2 processes
pm2 save
```

---

## Application Structure

```
/home/ubuntu/appbuilder/     # Application directory
├── dist/                    # Built files
├── prisma/                  # Database
│   └── dev.db              # SQLite database
├── src/                     # Source code
├── .env                     # Environment variables
└── server.ts               # Server file
```

---

## Ports Overview

- Port 3001: Your existing application (UNTOUCHED)
- Port 3002: New App Builder (NEW)

Both apps run independently and don't interfere with each other.
