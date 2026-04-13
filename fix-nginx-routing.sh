#!/bin/bash
# Fix nginx routing to correctly route /appbuilder to port 3002

echo "🔧 Fixing nginx routing..."

# Backup current config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# Update nginx configuration
sudo tee /etc/nginx/sites-available/default > /dev/null << 'NGINX_CONFIG'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    # App Builder on port 3002 with /appbuilder route (MUST come first)
    location /appbuilder/ {
        proxy_pass http://localhost:3002/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location = /appbuilder {
        return 301 /appbuilder/;
    }

    # Existing marketplace app on port 3001 (catch-all, comes last)
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
NGINX_CONFIG

# Test nginx configuration
echo "Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "Reloading nginx..."
    sudo systemctl reload nginx
    
    echo ""
    echo "✅ Nginx routing fixed!"
    echo ""
    echo "Test the routes:"
    echo "  curl http://localhost/appbuilder/"
    echo ""
    echo "Access in browser:"
    echo "  https://wormlike-loren-harmoniously.ngrok-free.dev/appbuilder/"
    echo ""
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi
