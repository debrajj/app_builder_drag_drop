#!/bin/bash
# Setup /builder route for app builder (avoiding conflict with /app)

echo "🔧 Setting up /builder route for App Builder..."

# Backup nginx config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# Create nginx configuration with /builder route
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    # App Builder on /builder route
    location ~ ^/builder(/.*)?$ {
        proxy_pass http://localhost:3002$1;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Multivendor marketplace - catch all (includes /app route)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Test nginx
sudo nginx -t

if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Your apps:"
    echo "  Marketplace: https://wormlike-loren-harmoniously.ngrok-free.dev/"
    echo "  Marketplace /app: https://wormlike-loren-harmoniously.ngrok-free.dev/app"
    echo "  App Builder: https://wormlike-loren-harmoniously.ngrok-free.dev/builder"
    echo ""
    echo "Testing locally:"
    curl http://localhost/builder | head -5
else
    echo "❌ Nginx config failed"
    exit 1
fi
