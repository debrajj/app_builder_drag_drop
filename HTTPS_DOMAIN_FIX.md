# 🔒 HTTPS Domain Configuration Fix

## 🔍 The Problem

You're seeing this error:
```
Unsafe attempt to load URL https://appbuilder.technoboost.in/ from frame with URL chrome-error://chromewebdata/. 
Domains, protocols and ports must match.
```

### Why This Happens

1. **Your domain uses HTTPS**: `https://appbuilder.technoboost.in`
2. **App is configured for HTTP**: `http://43.205.214.197:3002`
3. **Browser blocks mixed content**: HTTPS page cannot make HTTP API calls

This is a security feature called **Mixed Content Blocking**.

---

## ✅ The Solution

Update the app configuration to use HTTPS for API calls.

---

## 🛠️ How to Fix

### Option 1: Run Commands on Server (Recommended)

1. **SSH into server:**
   ```bash
   ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
   ```

2. **Run this one-liner:**
   ```bash
   cd /var/www/appbuilder && cat > .env << 'EOF'
   DATABASE_URL="postgresql://postgres:v4HmYtmNgvsVkRrB81AT@family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com:5432/page_builder_app?schema=public"
   PORT=3002
   NODE_ENV=production
   VITE_API_BASE_URL=https://appbuilder.technoboost.in
   ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
   JWT_SECRET="prod-jwt-secret-change-this-12345"
   EOF
   npm run build && pm2 restart appbuilder
   ```

3. **Wait for build to complete** (takes 1-2 minutes)

4. **Test:** Visit `https://appbuilder.technoboost.in`

---

### Option 2: Step by Step

If you prefer to run commands one by one:

```bash
# 1. SSH into server
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197

# 2. Navigate to app
cd /var/www/appbuilder

# 3. Update .env file
nano .env
```

Update these lines in the .env file:
```env
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
```

Save and exit (Ctrl+X, Y, Enter)

```bash
# 4. Rebuild
npm run build

# 5. Restart
pm2 restart appbuilder

# 6. Check logs
pm2 logs appbuilder
```

---

## 🔍 What Changed

### Before (HTTP - Broken)
```env
VITE_API_BASE_URL=http://43.205.214.197:3002
ALLOWED_ORIGINS=*
```

### After (HTTPS - Fixed)
```env
VITE_API_BASE_URL=https://appbuilder.technoboost.in
ALLOWED_ORIGINS=https://appbuilder.technoboost.in,http://43.205.214.197:3002
```

---

## 🧪 Testing After Fix

1. **Visit:** `https://appbuilder.technoboost.in`
2. **Should see:** Landing page (no errors)
3. **Click:** "Get Started"
4. **Login:** test@gmail.com / 12345
5. **Should see:** Dashboard with data

---

## 🔧 Troubleshooting

### Still seeing errors?

**Clear browser cache:**
```
Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
Select "Cached images and files"
Click "Clear data"
```

**Check server logs:**
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
pm2 logs appbuilder
```

**Verify build completed:**
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
cd /var/www/appbuilder
ls -la dist/
```

**Restart PM2:**
```bash
ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@43.205.214.197
pm2 restart appbuilder
pm2 logs appbuilder --lines 50
```

---

## 📊 Understanding the Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Browser (HTTPS)                                        │
│  https://appbuilder.technoboost.in                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS (Secure)
                     │
┌────────────────────▼────────────────────────────────────┐
│  Nginx Reverse Proxy (Port 443)                         │
│  - Handles SSL/TLS                                      │
│  - Forwards to backend                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP (Internal)
                     │
┌────────────────────▼────────────────────────────────────┐
│  Node.js App (Port 3002)                                │
│  - Serves frontend (dist/)                              │
│  - Handles API requests                                 │
│  - Connects to database                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Notes

### Current Setup
- ✅ HTTPS enabled via nginx
- ✅ SSL certificate (Let's Encrypt)
- ✅ CORS configured for specific domain
- ✅ JWT authentication

### Recommendations
1. **Change JWT_SECRET** to a strong random string
2. **Enable rate limiting** on login endpoint
3. **Add CSP headers** for additional security
4. **Regular security updates** for dependencies

---

## 📝 Configuration Files

### Frontend (.env on server)
```env
VITE_API_BASE_URL=https://appbuilder.technoboost.in
```
This tells the frontend where to make API calls.

### Backend (.env on server)
```env
ALLOWED_ORIGINS=https://appbuilder.technoboost.in
```
This tells the backend which domains can make requests.

### Nginx (if using reverse proxy)
```nginx
server {
    listen 443 ssl;
    server_name appbuilder.technoboost.in;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ✅ Checklist

After running the fix:

- [ ] SSH into server
- [ ] Update .env file
- [ ] Run `npm run build`
- [ ] Run `pm2 restart appbuilder`
- [ ] Clear browser cache
- [ ] Visit https://appbuilder.technoboost.in
- [ ] Test login
- [ ] Verify dashboard loads
- [ ] Check browser console (no errors)

---

## 🆘 Need Help?

If you're still having issues:

1. **Check PM2 logs:**
   ```bash
   pm2 logs appbuilder --lines 100
   ```

2. **Check nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Verify environment:**
   ```bash
   cd /var/www/appbuilder
   cat .env | grep VITE_API_BASE_URL
   ```

4. **Test API directly:**
   ```bash
   curl https://appbuilder.technoboost.in/api/pages
   # Should return 401 (authentication required)
   ```

---

## 🎉 Success!

Once fixed, you should be able to:
- ✅ Access https://appbuilder.technoboost.in
- ✅ See landing page without errors
- ✅ Login successfully
- ✅ Access dashboard with data
- ✅ No console errors

**Your app is now properly configured for HTTPS!** 🔒
