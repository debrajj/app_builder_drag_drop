# Test Checklist - Copy and Paste These Commands

## Step 1: Connect to EC2
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

## Step 2: Run the Complete Setup
```bash
cd ~/appbuilder && git pull && chmod +x COMPLETE_SETUP.sh && ./COMPLETE_SETUP.sh
```

Wait for it to complete. You should see:
- ✅ Setup Complete!
- URLs displayed

## Step 3: Verify App is Running
```bash
pm2 status
```

You should see:
- appbuilder: online ✅

## Step 4: Check Logs
```bash
pm2 logs appbuilder --lines 20
```

Look for:
- "Server running on http://localhost:3002" ✅

## Step 5: Test Locally on Server
```bash
curl http://localhost:3002
```

You should see HTML output ✅

## Step 6: Test via Nginx
```bash
curl http://localhost/appbuilder
```

You should see HTML output ✅

## Step 7: Test from Browser
Open these URLs in your browser:

1. Main app: https://wormlike-loren-harmoniously.ngrok-free.dev
2. App Builder: https://wormlike-loren-harmoniously.ngrok-free.dev/appbuilder

Both should work! ✅

## If Something Goes Wrong

### Check nginx status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check nginx logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Restart everything
```bash
pm2 restart appbuilder
sudo systemctl restart nginx
```

### View detailed app logs
```bash
pm2 logs appbuilder --lines 100
```

## Expected Results

✅ PM2 shows appbuilder as "online"
✅ curl localhost:3002 returns HTML
✅ curl localhost/appbuilder returns HTML
✅ Browser shows app at /appbuilder route
✅ Existing app on port 3001 still works
