#!/bin/bash

echo "🔐 Setting up Authentication System..."
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi
echo "✅ Prisma client generated"
echo ""

# Step 2: Push schema to database
echo "🗄️  Step 2: Pushing schema to database..."
npx prisma db push
if [ $? -ne 0 ]; then
    echo "❌ Failed to push schema to database"
    exit 1
fi
echo "✅ Schema pushed to database"
echo ""

# Step 3: Seed customers
echo "👥 Step 3: Seeding test customers..."
npx tsx prisma/seed-customers.ts
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed customers"
    exit 1
fi
echo "✅ Customers seeded"
echo ""

echo "🎉 Authentication setup complete!"
echo ""
echo "📝 Test Credentials:"
echo "   Admin: admin@example.com / admin123"
echo "   Customer 1: customer1@example.com / customer123"
echo "   Customer 2: customer2@example.com / customer123"
echo ""
echo "🚀 You can now start the server with: npm run dev"
