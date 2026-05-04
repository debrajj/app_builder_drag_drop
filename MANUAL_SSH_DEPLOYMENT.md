# Manual SSH Deployment Guide

## Server Details
- **IP**: 43.205.214.197
- **Port**: 3002
- **User**: ubuntu
- **SSH Key**: /Users/debrajroy/Downloads/multi-vender.pem
- **App Directory**: /var/www/appbuilder

## Step-by-Step Deployment

### Step 1: Connect to Server
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

### Step 2: Setup Application Directory
```bash
sudo mkdir -p /var/www/appbuilder
sudo chown -R ubuntu:ubuntu /var/www/appbuilder
cd /var/www/appbuilder
```

### Step 3: Clone Repository
```bash
git clone https://github.com/debrajj/app_builder_drag_drop.git .
```

Or if already cloned, pull latest:
```bash
git pull origin main
```

### Step 4: Setup Environment Variables
```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
JWT_SECRET="production-jwt-secret-change-this-to-random-string-12345"
EOF
```

### Step 5: Install Dependencies
```bash
npm install --production
```

### Step 6: Build Application
```bash
npm run build
```

### Step 7: Setup Database
```bash
npx prisma generate
npx prisma db push
```

### Step 8: Create Test User
```bash
cat > create-user.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('12345', 10);
  const user = await prisma.customer.upsert({
    where: { email: 'test@gmail.com' },
    update: { password },
    create: {
      email: 'test@gmail.com',
      password: password,
      name: 'Test User',
      role: 'customer'
    }
  });
  console.log('User created:', user.email);
  
  await prisma.page.updateMany({
    where: { customerId: null },
    data: { customerId: user.id }
  });
  await prisma.store.updateMany({
    where: { customerId: null },
    data: { customerId: user.id }
  });
  await prisma.productColor.updateMany({
    where: { customerId: null },
    data: { customerId: user.id }
  });
  await prisma.media.updateMany({
    where: { customerId: null },
    data: { customerId: user.id }
  });
  console.log('Data assigned to user');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
EOF

node create-user.js
rm create-user.js
```

### Step 9: Install PM2 (if not already installed)
```bash
sudo npm install -g pm2
```

### Step 10: Start Application with PM2
```bash
pm2 start npm --name "appbuilder" -- run dev
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### Step 11: Verify Deployment
```bash
pm2 status
pm2 logs appbuilder
```

## Access Your Application
- **URL**: http://43.205.214.197:3002
- **Email**: test@gmail.com
- **Password**: 12345

## Useful PM2 Commands

### View Logs
```bash
pm2 logs appbuilder
```

### Restart Application
```bash
pm2 restart appbuilder
```

### Stop Application
```bash
pm2 stop appbuilder
```

### Start Application
```bash
pm2 start appbuilder
```

### Delete Application
```bash
pm2 delete appbuilder
```

### View All Processes
```bash
pm2 status
```

## Troubleshooting

### Check if Port 3002 is Open
```bash
sudo netstat -tlnp | grep 3002
```

### Check Application Logs
```bash
pm2 logs appbuilder --lines 100
```

### Restart PM2
```bash
pm2 restart all
```

### Check Database Connection
```bash
psql "postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app" -c "SELECT 1"
```

## Update Application

To update the application with latest changes:

```bash
cd /var/www/appbuilder
git pull origin main
npm install --production
npm run build
npx prisma db push
pm2 restart appbuilder
```

## Backup Database

```bash
pg_dump "postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app" > backup.sql
```

## Restore Database

```bash
psql "postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app" < backup.sql
```

---

**Note**: If SSH connection is slow or timing out, try:
1. Check your internet connection
2. Verify SSH key permissions: `chmod 600 ~/.ssh/id_rsa`
3. Try with verbose mode: `ssh -v -i /path/to/key ubuntu@43.205.214.197`
4. Check if server is reachable: `ping 43.205.214.197`
