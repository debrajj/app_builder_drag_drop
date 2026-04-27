#!/bin/bash

# Setup SSL certificate for appbuilder.technoboost.in
# Run this AFTER DNS is configured and nginx-domain-setup.sh

echo "Installing Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

echo "Obtaining SSL certificate..."
sudo certbot --nginx -d appbuilder.technoboost.in --non-interactive --agree-tos --email your-email@example.com

echo "✅ SSL certificate installed!"
echo "Your site is now available at: https://appbuilder.technoboost.in"
