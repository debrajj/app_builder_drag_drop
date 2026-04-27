# Domain Setup Guide for appbuilder.technoboost.in

## Current Status
- ✅ App is running on: `http://43.205.214.197:3002`
- ❌ Domain `appbuilder.technoboost.in` returns "Not Found"

## Why It's Not Working
The domain isn't configured to point to your EC2 server. You need to:
1. Configure DNS records
2. Setup Nginx reverse proxy
3. Add SSL certificate

---

## Step 1: Configure DNS (Do This First!)

### Go to Your Domain Provider
(GoDaddy, Namecheap, Cloudflare, etc.)

### Add DNS Record
```
Type: A Record
Host: appbuilder
Value: 43.205.214.197
TTL: 3600 (or Auto)
```

### Wait for DNS Propagation
- Usually takes 5-30 minutes
- Can take up to 48 hours in rare cases

### Test DNS
```bash
# On your local machine
nslookup appbuilder.technoboost.in
# Should return: 43.205.214.197
```

---

## Step 2: Setup Nginx Reverse Proxy

### SSH into Your Server
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
```

### Install Nginx (if not installed)
```bash
sudo apt update
sudo apt install -y nginx
```

### Upload and Run Setup Script
```bash
# On your local machine, copy the script
scp -i /Users/debrajroy/Downloads/multi-vender.pem nginx-domain-setup.sh ubuntu@43.205.214.197:~/

# SSH into server
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197

# Run the script
chmod +x nginx-domain-setup.sh
./nginx-domain-setup.sh
```

### Test HTTP Access
```bash
# Should now work (without SSL)
curl http://appbuilder.technoboost.in
```

---

## Step 3: Setup SSL Certificate (HTTPS)

### Update Email in Script
Edit `setup-ssl.sh` and replace `your-email@example.com` with your actual email.

### Upload and Run SSL Script
```bash
# On your local machine
scp -i /Users/debrajroy/Downloads/multi-vender.pem setup-ssl.sh ubuntu@43.205.214.197:~/

# SSH into server
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197

# Run the script
chmod +x setup-ssl.sh
./setup-ssl.sh
```

### Test HTTPS Access
```bash
# Should now work with SSL
curl https://appbuilder.technoboost.in
```

---

## Step 4: Update Security Group (AWS)

### Allow HTTP and HTTPS Traffic
1. Go to AWS Console → EC2 → Security Groups
2. Find your instance's security group
3. Add inbound rules:
   - Type: HTTP, Port: 80, Source: 0.0.0.0/0
   - Type: HTTPS, Port: 443, Source: 0.0.0.0/0

---

## Quick Commands Reference

### Check if Nginx is Running
```bash
sudo systemctl status nginx
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### Check SSL Certificate Status
```bash
sudo certbot certificates
```

### Renew SSL Certificate (auto-renews, but manual command)
```bash
sudo certbot renew
```

---

## Troubleshooting

### Domain Still Shows "Not Found"
1. **Check DNS**: `nslookup appbuilder.technoboost.in`
   - If it doesn't return 43.205.214.197, DNS isn't configured
2. **Check Nginx**: `sudo nginx -t`
   - Should say "syntax is ok"
3. **Check Nginx is running**: `sudo systemctl status nginx`
4. **Check app is running**: `pm2 status`

### SSL Certificate Fails
1. Make sure DNS is working first
2. Make sure ports 80 and 443 are open in AWS Security Group
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### "502 Bad Gateway"
1. Check if app is running: `pm2 status`
2. Restart app: `pm2 restart appbuilder`
3. Check app logs: `pm2 logs appbuilder`

---

## Alternative: Use IP Address (Works Now!)

If you don't want to setup the domain, you can use:

**URL:** http://43.205.214.197:3002

**Login:**
- Email: test@gmail.com
- Password: 12345

This works immediately without any configuration!

---

## Summary

### What You Need to Do:
1. ✅ Configure DNS A record (appbuilder → 43.205.214.197)
2. ✅ Run `nginx-domain-setup.sh` on server
3. ✅ Run `setup-ssl.sh` on server
4. ✅ Update AWS Security Group (ports 80, 443)

### After Setup:
- HTTP: http://appbuilder.technoboost.in
- HTTPS: https://appbuilder.technoboost.in

### Time Required:
- DNS configuration: 5-30 minutes
- Nginx setup: 2 minutes
- SSL setup: 3 minutes
- Total: ~10-35 minutes

---

## Need Help?

If you get stuck, check:
1. DNS propagation: https://dnschecker.org
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. App logs: `pm2 logs appbuilder`
4. AWS Security Groups: Make sure ports 80, 443 are open

