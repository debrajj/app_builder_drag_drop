#!/bin/bash

# Setup Nginx reverse proxy for appbuilder.technoboost.in
# Run this on your EC2 server

echo "Setting up Nginx for appbuilder.technoboost.in..."

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/appbuilder << 'EOF'
server {
    listen 80;
    server_name appbuilder.technoboost.in;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/appbuilder /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

echo "✅ Nginx configured for appbuilder.technoboost.in"
echo "Next step: Setup SSL with certbot"
