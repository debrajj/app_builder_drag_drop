# SSH Deployment Summary

## Status: Ready for Manual Deployment

### Server Information
- **IP Address**: 43.205.214.197
- **Port**: 3002
- **SSH User**: ubuntu
- **SSH Key**: /Users/debrajroy/Downloads/multi-vender.pem
- **App Directory**: /var/www/appbuilder
- **Database**: PostgreSQL (AWS RDS - ap-south-1)

### Deployment Options

#### Option 1: Automated Script (Recommended)
```bash
bash deploy-to-server.sh
```
- Builds locally
- Creates deployment package
- Uploads via SCP
- Deploys on server
- Sets up PM2

#### Option 2: Quick SSH Deployment
```bash
bash quick-deploy-ssh.sh
```
- Clones from GitHub directly on server
- No large file transfers
- Faster for slow connections

#### Option 3: Manual Step-by-Step
Follow the guide in `MANUAL_SSH_DEPLOYMENT.md`
- Full control over each step
- Best for troubleshooting
- Useful for understanding the process

### Quick Start

1. **Connect to Server**
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

2. **Run Deployment**
```bash
cd /var/www/appbuilder
git clone https://github.com/debrajj/app_builder_drag_drop.git .
npm install --production
npm run build
npx prisma db push
pm2 start npm --name "appbuilder" -- run dev
```

3. **Access Application**
- URL: http://43.205.214.197:3002
- Email: test@gmail.com
- Password: 12345

### Features Deployed
✅ Page Builder with drag-and-drop
✅ Image proxy for external URLs
✅ Authentication system (JWT)
✅ PostgreSQL database
✅ Media library
✅ Global settings & styles
✅ Store management
✅ Product colors
✅ PM2 process management

### Database
- **Host**: family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com
- **Database**: page_builder_app
- **User**: postgres
- **Password**: v4HmYtmNgvsVkRrB81AT

### Environment Variables
```
DATABASE_URL=postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
JWT_SECRET=production-jwt-secret-change-this-to-random-string-12345
```

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs appbuilder

# Restart
pm2 restart appbuilder

# Stop
pm2 stop appbuilder

# Start
pm2 start appbuilder
```

### Troubleshooting

**SSH Connection Timeout**
- Check internet connection
- Verify SSH key: `chmod 600 ~/.ssh/id_rsa`
- Test connection: `ssh -v -i /path/to/key ubuntu@43.205.214.197`

**Application Won't Start**
- Check logs: `pm2 logs appbuilder`
- Verify database connection
- Check port 3002 is open: `sudo netstat -tlnp | grep 3002`

**Database Connection Error**
- Verify DATABASE_URL in .env
- Check AWS RDS security groups
- Test connection: `psql "postgresql://..."`

### Files Included
- `deploy-to-server.sh` - Full automated deployment
- `quick-deploy-ssh.sh` - Quick SSH deployment
- `MANUAL_SSH_DEPLOYMENT.md` - Step-by-step guide
- `SSH_CONNECTION_GUIDE.md` - SSH setup guide

### Next Steps
1. Choose deployment method
2. Run deployment script or follow manual guide
3. Access application at http://43.205.214.197:3002
4. Login with test@gmail.com / 12345
5. Start building pages!

### Support
For issues or questions:
1. Check logs: `pm2 logs appbuilder`
2. Review MANUAL_SSH_DEPLOYMENT.md
3. Check GitHub repository: https://github.com/debrajj/app_builder_drag_drop

---
**Last Updated**: May 4, 2026
**Status**: Ready for Deployment
**Repository**: https://github.com/debrajj/app_builder_drag_drop
