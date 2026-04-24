# Quick Fix Commands - Copy & Paste

## 🚀 One-Command Fix

SSH into your server and run this single command:

```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 "cd /var/www/appbuilder && git pull && npm install && npx prisma generate && npx prisma db push --accept-data-loss && npm run build && pm2 restart appbuilder || pm2 start npm --name 'appbuilder' -- start && pm2 save && pm2 logs appbuilder --lines 20"
```

## 📋 Or Step-by-Step

### 1. SSH into server
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

### 2. Navigate to app directory
```bash
cd /var/www/appbuilder
```

### 3. Pull latest code
```bash
git pull
```

### 4. Install dependencies
```bash
npm install
```

### 5. Setup database
```bash
npx prisma generate
npx prisma db push
```

### 6. Build
```bash
npm run build
```

### 7. Restart PM2
```bash
pm2 restart appbuilder
```

If PM2 process doesn't exist:
```bash
pm2 start npm --name "appbuilder" -- start
pm2 save
```

### 8. Check logs
```bash
pm2 logs appbuilder --lines 30
```

### 9. Test
```bash
curl http://localhost:3002
```

## 🔧 Alternative: Use the Fix Script

### Upload the fix script to server:
```bash
# From your local machine
scp -i /Users/debrajroy/Downloads/multi-vender.pem fix-502-error.sh ubuntu@43.205.214.197:~/
```

### Then SSH and run it:
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
chmod +x fix-502-error.sh
sudo ./fix-502-error.sh
```

## 🆘 If Still Not Working

### Check what's actually running:
```bash
pm2 list
sudo netstat -tulpn | grep 3002
```

### Check nginx logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check app logs:
```bash
pm2 logs appbuilder --lines 50
```

### Nuclear option (complete restart):
```bash
cd /var/www/appbuilder
pm2 delete appbuilder
rm -rf node_modules dist
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 start npm --name "appbuilder" -- start
pm2 save
sudo systemctl restart nginx
```

## ✅ Success Indicators

You should see:
- PM2 shows "appbuilder" as "online"
- `curl http://localhost:3002` returns HTML
- No errors in `pm2 logs appbuilder`
- https://appbuilder.technoboost.in loads without 502

## 📞 Quick Diagnostics

```bash
# All-in-one status check
echo "=== PM2 Status ===" && pm2 list && \
echo "=== Port 3002 ===" && sudo netstat -tulpn | grep 3002 && \
echo "=== Nginx Status ===" && sudo systemctl status nginx --no-pager && \
echo "=== Recent Logs ===" && pm2 logs appbuilder --lines 10 --nostream
```
