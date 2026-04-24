# Server Commands to Fix Domain Issue

## Step 1: SSH into Server
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

## Step 2: Navigate to App Directory
```bash
cd /var/www/appbuilder
```

## Step 3: Update Environment Configuration
```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
JWT_SECRET="prod-jwt-secret-change-this-12345"
EOF
```

## Step 4: Rebuild Application
```bash
npm run build
```

## Step 5: Restart PM2
```bash
pm2 restart appbuilder
```

## Step 6: Verify
```bash
pm2 logs appbuilder --lines 20
```

## Step 7: Exit Server
```bash
exit
```

---

## Quick One-Liner (Copy and Paste on Server)

After SSH'ing into the server, run this:

```bash
cd /var/www/appbuilder && cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
JWT_SECRET="prod-jwt-secret-change-this-12345"
EOF
npm run build && pm2 restart appbuilder && pm2 logs appbuilder --lines 20
```

---

## What This Fixes

- ✅ Changes API base URL from HTTP to HTTPS
- ✅ Updates CORS to allow your domain
- ✅ Rebuilds the app with new configuration
- ✅ Restarts the server

After running these commands, visit:
**https://appbuilder.technoboost.in**

Login: test@gmail.com / 12345
