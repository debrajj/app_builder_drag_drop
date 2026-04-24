#!/bin/bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 << 'ENDSSH'
set -e
echo "🔧 Quick fix deployment..."

# Remove old directory if exists
sudo rm -rf /var/www/appbuilder

# Create directory
sudo mkdir -p /var/www
cd /var/www

# Clone with depth 1 (faster)
echo "📥 Cloning repository (shallow clone)..."
sudo git clone --depth 1 https://github.com/debrajj/app_builder_drag_drop.git appbuilder
sudo chown -R ubuntu:ubuntu appbuilder

cd appbuilder

echo "📦 Installing dependencies..."
npm install --production

echo "📝 Creating .env..."
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
JWT_SECRET="prod-jwt-secret-change-this-12345"
ENVEOF

echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "👥 Creating user..."
node -e "const{PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');const p=new PrismaClient();(async()=>{const pw=await bcrypt.hash('12345',10);const u=await p.customer.upsert({where:{email:'test@gmail.com'},update:{password:pw},create:{email:'test@gmail.com',password:pw,name:'Test User',role:'customer'}});console.log('User:',u.email);await p.page.updateMany({data:{customerId:u.id}});await p.store.updateMany({data:{customerId:u.id}});await p.productColor.updateMany({data:{customerId:u.id}});await p.media.updateMany({data:{customerId:u.id}});console.log('Data assigned');await p.\$disconnect();})();"

echo "🔨 Building..."
npm run build

echo "🔄 Restarting PM2..."
pm2 stop appbuilder 2>/dev/null || true
pm2 delete appbuilder 2>/dev/null || true
pm2 start npm --name appbuilder -- start
pm2 save

echo "✅ Done!"
pm2 logs appbuilder --lines 10
ENDSSH
