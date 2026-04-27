# 🏠 How to See the Landing Page

## Current Situation

You're seeing the **Dashboard** instead of the **Landing Page** because you're already logged in. The app remembers your login using a token stored in your browser.

---

## ✅ How to See the Landing Page

### Option 1: Logout (Easiest)

1. Look at the **bottom left** of the sidebar
2. You'll see your user info (Test User / test@gmail.com)
3. Click the **Logout button** (red icon)
4. You'll be redirected to the **Landing Page**

### Option 2: Clear Browser Storage

1. Open browser **Developer Tools** (F12 or Right-click → Inspect)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `https://appbuilder.technoboost.in`
4. Delete the `token` entry
5. Refresh the page
6. You'll see the **Landing Page**

### Option 3: Use Incognito/Private Window

1. Open a new **Incognito/Private** window
2. Visit: `https://appbuilder.technoboost.in`
3. You'll see the **Landing Page** (no login token)

### Option 4: Click Logo (New Feature)

1. Click on **"AppBuilder"** logo in the top left
2. It will ask: "Logout and return to landing page?"
3. Click **OK**
4. You'll see the **Landing Page**

---

## 🎯 User Flow

```
┌─────────────────────┐
│   Landing Page      │ ← First visit (no token)
│   (Public)          │
└──────────┬──────────┘
           │ Click "Get Started"
           ↓
┌─────────────────────┐
│   Login Page        │
└──────────┬──────────┘
           │ Login Success
           ↓
┌─────────────────────┐
│   Dashboard         │ ← Subsequent visits (has token)
│   (Protected)       │
└──────────┬──────────┘
           │ Click Logout
           ↓
┌─────────────────────┐
│   Landing Page      │ ← After logout
└─────────────────────┘
```

---

## 🔍 Why This Happens

The app uses **JWT tokens** for authentication:

1. **First visit**: No token → Shows Landing Page
2. **After login**: Token saved → Shows Dashboard
3. **Next visits**: Token exists → Auto-login → Shows Dashboard
4. **After logout**: Token removed → Shows Landing Page

This is **normal behavior** for authenticated apps!

---

## 🧪 Test the Landing Page

1. **Logout** from the dashboard
2. You'll see:
   - Hero section with gradient
   - "Get Started" button in header
   - Feature cards
   - Bottom CTA section
3. Click **"Get Started"**
4. Login with: `test@gmail.com` / `12345`
5. Back to Dashboard

---

## 📝 For New Users

New users (without login token) will:
1. See Landing Page first ✅
2. Click "Get Started"
3. Login or Register
4. Access Dashboard

---

## ✨ Summary

- **Logged in** = Dashboard (current state)
- **Logged out** = Landing Page
- **To see landing page** = Logout or use incognito

**Your app is working correctly!** The landing page shows for unauthenticated users, and the dashboard shows for authenticated users.
