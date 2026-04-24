#!/bin/bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 << 'ENDSSH'
sudo mkdir -p /var/www
cd /var/www
if [ -d "appbuilder" ]; then
  sudo rm -rf appbuilder
fi
sudo git clone https://github.com/debrajj/app_builder_drag_drop.git appbuilder
sudo chown -R ubuntu:ubuntu appbuilder
cd appbuilder
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
JWT_SECRET="prod-jwt-secret-change-this-12345"
ENVEOF
npm install
npx prisma generate
npx prisma db push
node -e "const{PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');const p=new PrismaClient();(async()=>{const pw=await bcrypt.hash('12345',10);const u=await p.customer.upsert({where:{email:'test@gmail.com'},update:{password:pw},create:{email:'test@gmail.com',password:pw,name:'Test User',role:'customer'}});await p.page.updateMany({data:{customerId:u.id}});await p.store.updateMany({data:{customerId:u.id}});await p.productColor.updateMany({data:{customerId:u.id}});await p.media.updateMany({data:{customerId:u.id}});console.log('✅ User and data ready');await p.\$disconnect();})();"
npm run build
pm2 restart appbuilder || pm2 start npm --name appbuilder -- start
pm2 save
echo "✅ Done!"
ENDSSH
