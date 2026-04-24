# Login Credentials

## 🔑 Primary Account (Current Data Owner)

**Email:** test@gmail.com  
**Password:** 12345

This account owns all existing data:
- ✅ 1 page
- ✅ 8 stores
- ✅ 2 product colors
- ✅ All media items

---

## 👤 Additional Test Accounts

### Admin Account (Full Access)
**Email:** admin@example.com  
**Password:** admin123  
**Role:** Admin - Can view and manage all customers' data

### Customer 1
**Email:** customer1@example.com  
**Password:** customer123  
**Role:** Customer - Can only see their own data

### Customer 2
**Email:** customer2@example.com  
**Password:** customer123  
**Role:** Customer - Can only see their own data

---

## 🚀 Quick Start

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. Login with **test@gmail.com** / **12345**

4. You'll see all your existing data (pages, stores, product colors, media)

---

## 🔐 Authentication Features

✅ **Secure Login** - JWT token-based authentication  
✅ **Customer Isolation** - Each customer sees only their data  
✅ **Admin Access** - Admin can view all customers' data  
✅ **Auto-Login** - Token persists across browser sessions  
✅ **Protected Routes** - All API endpoints require authentication  

---

## 📝 Testing Customer Isolation

1. Login as **test@gmail.com** - See all existing data
2. Logout
3. Login as **customer1@example.com** - See empty dashboard
4. Create some test data
5. Logout
6. Login as **test@gmail.com** again - Your original data is still there
7. Login as **admin@example.com** - See data from all customers

---

## 🛠️ Troubleshooting

**Can't login?**
- Check server is running (`npm run dev`)
- Check database connection in `.env`
- Try clearing browser localStorage

**Don't see data?**
- Make sure you're logged in as **test@gmail.com**
- Check browser console for errors
- Verify token in localStorage

**Need to reset?**
- Run: `npx tsx migrate-data-to-test-user.ts`
- This will reassign all data to test@gmail.com

---

## 📚 Documentation

- Full guide: `AUTHENTICATION_GUIDE.md`
- API docs: `API_DOCUMENTATION.md`
- Deployment: `DEPLOYMENT_GUIDE.md`
