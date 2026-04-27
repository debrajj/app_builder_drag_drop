#!/bin/bash

echo "🚀 Setting up Admin Panel..."
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Push database schema
echo "🗄️  Updating database schema..."
npx prisma db push

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
npx prisma generate

# Seed database with default admin
echo "🌱 Seeding database with default admin..."
npx prisma db seed

echo ""
echo "✅ Admin Panel setup complete!"
echo ""
echo "📝 Default Admin Credentials:"
echo "   Email: admin@example.com"
echo "   Password: 12345"
echo ""
echo "🌐 Access the admin panel at:"
echo "   http://localhost:3000/admin/login"
echo ""
echo "🚀 Start the development server with:"
echo "   npm run dev"
echo ""
