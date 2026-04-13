# Setup Instructions for /appbuilder Route

## Quick Setup (One Command)

On your EC2 server, run:

```bash
cd ~/appbuilder
git pull
chmod +x COMPLETE_SETUP.sh
./COMPLETE_SETUP.sh
```

This will:
1. Stop existing app
2. Pull latest code
3. Configure environment with BASE_PATH=/appbuilder
4. Install dependencies
5. Build the app
6. Start with PM2
7. Configure nginx
8. Reload nginx

## After Setup

Your apps will be accessible at:

### Main App (Port 3001)
- http://43.205.214.197:3001
- https://wormlike-loren-harmoniously.ngrok-free.dev

### App Builder (Port 3002 via /appbuilder route)
- http://43.205.214.197:3001/appbuilder
- https://wormlike-loren-harmoniously.ngrok-free.dev/appbuilder

## Manual Setup (Step by Step)

If you prefer to run commands manually:

### 1. Deploy the app
```bash
cd ~/appbuilder
chmod +x deploy-with-basepath.sh
./deploy-with-basepath.sh
```

### 2. Setup nginx
```bash
chmod +x setup-nginx-appbuilder.sh
./setup-nginx-appbuilder.sh
```

## Troubleshooting

### Check if app is running
```bash
pm2 status
pm2 logs appbuilder
```

### Test locally
```bash
curl http://localhost:3002
```

### Check nginx
```bash
sudo nginx -t
sudo systemctl status nginx
```

### Restart everything
```bash
pm2 restart appbuilder
sudo systemctl restart nginx
```

## Important Notes

- Your existing app on port 3001 will NOT be affected
- The new app runs on port 3002 internally
- Nginx routes /appbuilder to port 3002
- Both apps work independently
