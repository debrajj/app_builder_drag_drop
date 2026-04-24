# 🚀 Deploy to Server - Quick Guide

## One-Command Deployment

```bash
./deploy-to-server.sh
```

This script will:
1. ✅ Build the application locally
2. ✅ Create deployment package
3. ✅ Upload to server (43.205.214.197)
4. ✅ Install dependencies on server
5. ✅ Setup database with authentication
6. ✅ Create test@gmail.com user
7. ✅ Start application with PM2
8. ✅ Verify deployment

---

## Server Details

- **URL**: http://43.205.214.197:3002
- **Port**: 3002
- **PM2 Name**: appbuilder
- **Directory**: /var/www/appbuilder

---

## Login Credentials (After Deployment)

```
Email: test@gmail.com
Password: 12345
```

---

## Manual Deployment (Alternative)

If you prefer manual deployment:

### 1. Build Locally
```bash
npm run build
```

### 2. Connect to Server
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

### 3. Setup on Server
```bash
# Navigate to app directory
cd /var/www/appbuilder

# Pull latest code (if using git)
git pull

# Install dependencies
npm install --production

# Setup environment
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
JWT_SECRET="production-jwt-secret-change-this-12345"
EOF

# Setup database
npx prisma generate
npx prisma db push

# Create user and migrate data
npx tsx migrate-data-to-test-user.ts

# Restart PM2
pm2 restart appbuilder
```

---

## Useful Commands

### View Logs
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 'pm2 logs appbuilder'
```

### Restart Application
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 'pm2 restart appbuilder'
```

### Stop Application
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 'pm2 stop appbuilder'
```

### Check Status
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 'pm2 status'
```

### SSH into Server
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

---

## Troubleshooting

### Check if Server is Running
```bash
curl http://43.205.214.197:3002
```

### View PM2 Logs
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
pm2 logs appbuilder --lines 100
```

### Restart Everything
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
cd /var/www/appbuilder
pm2 restart appbuilder
```

### Check Database Connection
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
cd /var/www/appbuilder
npx prisma db push
```

---

## What Gets Deployed

- ✅ Built frontend (dist/)
- ✅ Backend server (server.ts)
- ✅ Authentication middleware (auth-middleware.ts)
- ✅ Database schema (prisma/)
- ✅ Dependencies (package.json)
- ✅ Environment config (.env.production)

---

## After Deployment

1. Visit: http://43.205.214.197:3002
2. You'll see the landing page
3. Click "Get Started"
4. Login with: test@gmail.com / 12345
5. Access your dashboard with all data

---

## Security Notes

⚠️ **Important**: After deployment, change the JWT_SECRET in production:

```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
cd /var/www/appbuilder
nano .env
# Change JWT_SECRET to a strong random string
pm2 restart appbuilder
```

---

## Quick Deploy Checklist

- [ ] Run `./deploy-to-server.sh`
- [ ] Wait for deployment to complete
- [ ] Visit http://43.205.214.197:3002
- [ ] Test login with test@gmail.com / 12345
- [ ] Verify data is visible
- [ ] Change JWT_SECRET in production

---

## Need Help?

Check these files:
- `DEPLOYMENT_GUIDE.md` - Full deployment guide
- `AUTHENTICATION_GUIDE.md` - Authentication details
- `LOGIN_CREDENTIALS.md` - All login credentials

---

## 🎉 Ready to Deploy?

Run this command:

```bash
./deploy-to-server.sh
```

Then visit: **http://43.205.214.197:3002**
