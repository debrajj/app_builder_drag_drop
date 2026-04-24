#!/bin/bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197 << 'ENDSSH'
cd /var/www/appbuilder
git pull
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
PORT=3002
NODE_ENV=production
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
JWT_SECRET="prod-jwt-secret-change-this-12345"
ENVEOF
npm install
npm run build
pm2 restart appbuilder
echo "✅ Deployment complete!"
ENDSSH
