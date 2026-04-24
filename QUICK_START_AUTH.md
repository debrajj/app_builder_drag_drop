# 🚀 Quick Start - Authentication

## ✅ Setup Complete!

Your application now has full authentication with customer-specific data isolation.

---

## 🔑 Login Credentials

```
Email:    test@gmail.com
Password: 12345
```

This account has all your existing data (1 page, 8 stores, 2 product colors).

---

## 🏃 Start the App

```bash
npm run dev
```

Then open: **http://localhost:3000**

---

## ✨ What's Working

- ✅ Secure JWT authentication
- ✅ Customer-specific data (each user sees only their data)
- ✅ Protected API routes
- ✅ Auto-login on page refresh
- ✅ Logout functionality
- ✅ All existing data assigned to test@gmail.com

---

## 📝 Test Accounts

| Email | Password | Role | Data |
|-------|----------|------|------|
| test@gmail.com | 12345 | Customer | All existing data |
| admin@example.com | admin123 | Admin | Can see all data |
| customer1@example.com | customer123 | Customer | Empty |
| customer2@example.com | customer123 | Customer | Empty |

---

## 🧪 Test Customer Isolation

1. Login as `test@gmail.com` → See all your data
2. Logout
3. Login as `customer1@example.com` → See empty dashboard
4. Create a test page
5. Logout
6. Login as `test@gmail.com` → Your data is still there (customer1's page is not visible)

---

## 🛠️ Useful Commands

### Add New Customer
```bash
npx tsx add-customer.ts
```

### Reassign All Data to test@gmail.com
```bash
npx tsx migrate-data-to-test-user.ts
```

### Reset Everything
```bash
npx prisma db push --force-reset
npx tsx prisma/seed-customers.ts
npx tsx migrate-data-to-test-user.ts
```

---

## 📚 Full Documentation

- **LOGIN_CREDENTIALS.md** - Quick reference
- **AUTH_SETUP_COMPLETE.md** - Complete setup summary
- **AUTHENTICATION_GUIDE.md** - Full authentication guide

---

## 🆘 Troubleshooting

**Can't login?**
```bash
# Check server is running
npm run dev

# Clear browser storage
# Open browser console and run:
localStorage.clear()
```

**Don't see data?**
```bash
# Reassign data to test@gmail.com
npx tsx migrate-data-to-test-user.ts
```

---

## 🎉 You're Ready!

Start the server and login with **test@gmail.com / 12345** to see your data!
