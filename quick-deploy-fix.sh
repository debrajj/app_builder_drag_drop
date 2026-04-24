#!/bin/bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 'bash -s' << 'ENDSSH'
set -e
echo "🚀 Starting deployment..."

# Check if directory exists
if [ -d "/var/www/appbuilder" ]; then
    echo "📁 Directory exists, updating..."
    cd /var/www/appbuilder
    git pull
else
    echo "📁 Creating new directory..."
    sudo mkdir -p /var/www
    cd /var/www
    sudo git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
    sudo chown -R ubuntu:ubuntu appbuilder
    cd appbuilder
fi

echo "📝 Configuring environment..."
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
JWT_SECRET="prod-jwt-secret-change-this-12345"
ENVEOF

echo "📦 Installing dependencies..."
npm install

echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "👥 Creating user..."
node -e "const{PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');const prisma=new PrismaClient();(async()=>{try{const password=await bcrypt.hash('12345',10);const user=await prisma.customer.upsert({where:{email:'test@gmail.com'},update:{password},create:{email:'test@gmail.com',password:password,name:'Test User',role:'customer'}});console.log('✅ User:',user.email);await prisma.page.updateMany({data:{customerId:user.id}});await prisma.store.updateMany({data:{customerId:user.id}});await prisma.productColor.updateMany({data:{customerId:user.id}});await prisma.media.updateMany({data:{customerId:user.id}});console.log('✅ Data assigned');}catch(e){console.error('Error:',e.message);}finally{await prisma.\$disconnect();}})();"

echo "🔨 Building..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart appbuilder || pm2 start npm --name appbuilder -- start
pm2 save

echo "✅ Done!"
ENDSSH
