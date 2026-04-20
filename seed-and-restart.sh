#!/bin/bash
# Seed the database and restart the app

echo "🌱 Seeding database..."
cd ~/appbuilder

# Run the seed
npx prisma db seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
    
    echo "🔄 Restarting app..."
    pm2 restart appbuilder
    
    echo ""
    echo "✅ Done!"
    echo ""
    echo "Check your app at:"
    echo "  https://wormlike-loren-harmoniously.ngrok-free.dev/app/appbuilder"
    echo ""
    echo "Verify pages in database:"
    sqlite3 prisma/dev.db "SELECT id, name, slug FROM Page;"
else
    echo "❌ Seeding failed"
    exit 1
fi
