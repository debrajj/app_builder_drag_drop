# EC2 Quick Start Guide

## Quick Deployment (Automated)

### 1. Connect to EC2
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

### 2. Run Deployment Script
```bash
# Download and run the deployment script
curl -o deploy.sh https://raw.githubusercontent.com/debrajj/app_builder_drag_drop/main/deploy-to-ec2.sh
chmod +x deploy.sh
./deploy.sh
```

### 3. Configure Nginx
Add this to your existing nginx server block (usually in `/etc/nginx/sites-available/default`):

```nginx
location /appbuilder {
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
```

Then reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Access Your App
- http://43.205.214.197:3001/appbuilder

---

## Manual Deployment (Step by Step)

If you prefer manual control:

### 1. Connect and Setup Directory
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
sudo mkdir -p /var/www/appbuilder
cd /var/www
```

### 2. Clone Repository
```bash
sudo git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
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
BASE_PATH=/appbuilder
DISABLE_HMR=true
EOF
```

### 5. Update Server File
```bash
# Backup original
cp server.ts server.ts.backup

# Use the updated version with BASE_PATH support
cp server-with-basepath.ts server.ts
```

### 6. Setup Database
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 7. Build Application
```bash
npm run build
```

### 8. Start with PM2
```bash
# Install PM2 if not installed
sudo npm install -g pm2

# Start application
pm2 start npm --name "appbuilder" -- start

# Save PM2 config
pm2 save

# Setup startup script
pm2 startup
```

### 9. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/default
```

Add the location block shown above, then:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Troubleshooting

### Check Application Status
```bash
pm2 status
pm2 logs appbuilder
```

### Check if Port is in Use
```bash
sudo netstat -tulpn | grep 3002
```

### Restart Application
```bash
pm2 restart appbuilder
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Database Issues
```bash
cd /var/www/appbuilder
npx prisma studio  # Opens database GUI on port 5555
```

---

## Updating the Application

```bash
cd /var/www/appbuilder
git pull
npm install
npm run build
pm2 restart appbuilder
```

---

## Security Checklist

- [ ] Firewall configured (port 3002 not exposed externally)
- [ ] Environment variables secured
- [ ] Database backed up regularly
- [ ] SSL certificate installed (recommended)
- [ ] Regular security updates applied

---

## Useful Commands

```bash
# View all PM2 processes
pm2 list

# Monitor resources
pm2 monit

# View detailed logs
pm2 logs appbuilder --lines 100

# Stop application
pm2 stop appbuilder

# Delete from PM2
pm2 delete appbuilder

# Restart nginx
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx
```
