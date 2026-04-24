# 502 Bad Gateway Fix Guide

## Quick Fix (Run on EC2)

```bash
# SSH into your server
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197

# Upload and run the check script
chmod +x check-and-restart.sh
./check-and-restart.sh
```

## Common Causes & Solutions

### 1. Backend Not Running
**Check:**
```bash
pm2 list
# or
sudo netstat -tulpn | grep 3002
```

**Fix:**
```bash
cd /var/www/appbuilder  # or wherever your app is
pm2 restart appbuilder
# or if not started yet:
pm2 start npm --name "appbuilder" -- start
pm2 save
```

### 2. Wrong Port in Nginx Config
**Check nginx config:**
```bash
sudo cat /etc/nginx/sites-available/appbuilder
```

**Should proxy to:**
```nginx
proxy_pass http://localhost:3002;
```

### 3. Database Issues
**Check database:**
```bash
cd /var/www/appbuilder
npx prisma db push
npx prisma db seed
```

### 4. Environment Variables Missing
**Check .env file:**
```bash
cat .env
```

**Should contain:**
```
DATABASE_URL="file:./prisma/dev.db"
PORT=3002
NODE_ENV=production
```

### 5. Build Not Complete
**Rebuild:**
```bash
npm run build
pm2 restart appbuilder
```

## Step-by-Step Diagnosis

### Step 1: Check Backend
```bash
pm2 logs appbuilder --lines 50
```
Look for errors in the logs.

### Step 2: Check Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
```

### Step 3: Check Firewall
```bash
sudo ufw status
# Should show port 3002 allowed
```

### Step 4: Test Direct Access
```bash
curl http://localhost:3002
# Should return HTML or JSON
```

### Step 5: Check Nginx Error Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

## Full Restart Sequence

```bash
# 1. Stop everything
pm2 stop appbuilder

# 2. Navigate to app
cd /var/www/appbuilder

# 3. Pull latest code (if needed)
git pull

# 4. Install dependencies
npm install

# 5. Setup database
npx prisma generate
npx prisma db push

# 6. Build
npm run build

# 7. Start
pm2 start npm --name "appbuilder" -- start
pm2 save

# 8. Restart nginx
sudo systemctl restart nginx

# 9. Check status
pm2 logs appbuilder --lines 20
```

## If Nothing Works

### Option 1: Check if app directory exists
```bash
ls -la /var/www/appbuilder
# or
ls -la ~/appbuilder
```

### Option 2: Redeploy from scratch
```bash
cd /var/www
sudo rm -rf appbuilder
git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
cd appbuilder
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run build
pm2 start npm --name "appbuilder" -- start
pm2 save
```

## Check Domain Configuration

If using domain `appbuilder.technoboost.in`:

### DNS Settings
- Should point to: 43.205.214.197
- Check with: `nslookup appbuilder.technoboost.in`

### Nginx Config for Domain
```nginx
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
```

Save to: `/etc/nginx/sites-available/appbuilder`

Then:
```bash
sudo ln -s /etc/nginx/sites-available/appbuilder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Contact Info
- EC2 IP: 43.205.214.197
- App Port: 3002
- Domain: appbuilder.technoboost.in
