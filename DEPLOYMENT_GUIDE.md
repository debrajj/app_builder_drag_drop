# Deployment Guide for App Builder on EC2 (Standalone)

## Project Information
- **EC2 IP**: 43.205.214.197
- **Existing Project**: http://43.205.214.197:3001 (will NOT be touched)
- **New App Port**: 3002
- **New App URL**: http://43.205.214.197:3002
- **SSH Command**: `ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197`
- **Repository**: https://github.com/debrajj/app_builder_drag_drop.git

## Important Notes
- This is a STANDALONE deployment
- Your existing app on port 3001 will NOT be affected
- The new app will run independently on port 3002
- No nginx configuration changes needed (unless you want reverse proxy)

## Deployment Steps

### 1. Connect to EC2
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

### 2. Navigate to Project Directory
```bash
cd /var/www  # or wherever your main project is located
```

### 3. Clone the App Builder Repository
```bash
git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
cd appbuilder
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Configure Environment Variables
Create `.env` file:
```bash
nano .env
```

Add your environment variables:
```
DATABASE_URL="file:./prisma/dev.db"
PORT=3002
NODE_ENV=production
```

### 6. Setup Database
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 7. Build the Application
```bash
npm run build
```

### 8. Open Firewall Port (if needed)
Allow port 3002 through firewall:
```bash
sudo ufw allow 3002/tcp
# Or if using AWS Security Groups, add inbound rule for port 3002
```

### 9. Setup PM2 for Process Management
```bash
# Install PM2 if not already installed
sudo npm install -g pm2

# Start the application
pm2 start npm --name "appbuilder" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 10. Access Your Application
Your app is now running at:
- http://43.205.214.197:3002

No additional configuration needed!

## Alternative: Using Docker

If you prefer Docker deployment:

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
```

### 2. Build and Run
```bash
docker build -t appbuilder .
docker run -d -p 3002:3002 --name appbuilder appbuilder
```

## Troubleshooting

### Check Application Logs
```bash
pm2 logs appbuilder
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart Services
```bash
pm2 restart appbuilder
sudo systemctl restart nginx
```

### Check Port Availability
```bash
sudo netstat -tulpn | grep 3002
```

## Security Considerations

1. **Firewall**: Ensure port 3002 is not exposed externally (only nginx should access it)
2. **Environment Variables**: Keep sensitive data in `.env` and never commit it
3. **Database**: Backup regularly
4. **SSL**: Consider adding SSL certificate using Let's Encrypt

## Maintenance Commands

```bash
# Update application
cd /var/www/appbuilder
git pull
npm install
npm run build
pm2 restart appbuilder

# View running processes
pm2 list

# Monitor application
pm2 monit
```
