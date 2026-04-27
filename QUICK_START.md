# 🚀 Admin Panel - Quick Start

## ⚡ 30-Second Setup

```bash
# Run the automated setup
./setup-admin.sh

# Start the server
npm run dev
```

## 🔑 Access Admin Panel

1. **URL**: http://localhost:3000/admin/login
2. **Email**: admin@example.com
3. **Password**: 12345

## 📍 Admin Routes

- `/admin/login` - Login page
- `/admin/dashboard` - Dashboard with stats
- `/admin/users` - User management
- `/admin/admins` - Admin management

## ✨ Key Features

### Dashboard
- Total users, active users, inactive users
- Total admins, recent users (7 days)
- Recent users table with details

### User Management
- ✅ View all users (paginated)
- ✅ Search by name/email
- ✅ Filter by status/role
- ✅ Add new users
- ✅ Edit users
- ✅ Delete users
- ✅ Reset passwords
- ✅ Toggle user status

### Admin Management
- ✅ View all admins
- ✅ Create new admins
- ✅ Track admin activity

## 🎯 Quick Actions

### Create a User
1. Go to User Management
2. Click "Add User"
3. Fill in details
4. Select role (User/Admin)
5. Set status (Active/Inactive/Suspended)
6. Click "Create"

### Reset Password
1. Go to User Management
2. Find the user
3. Click the key icon
4. Enter new password
5. Confirm

### Toggle User Status
1. Go to User Management
2. Find the user
3. Click the status badge
4. Status toggles between active/inactive

## 🔧 Manual Setup (if needed)

```bash
# Install dependencies
npm install

# Update database
npx prisma db push
npx prisma generate

# Create admin
npx prisma db seed

# Start server
npm run dev
```

## 📊 API Quick Reference

```bash
# Dashboard
GET /api/admin/dashboard/stats
GET /api/admin/dashboard/recent-users

# Users
GET /api/admin/users
POST /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
POST /api/admin/users/:id/reset-password
PATCH /api/admin/users/:id/status

# Admins
GET /api/admin/admins
POST /api/admin/admins
```

## 🐛 Troubleshooting

**Can't login?**
- Check credentials: admin@example.com / 12345
- Run: `npx prisma db seed`

**Database error?**
- Run: `npx prisma db push`

**Build error?**
- Run: `npm install`

## 📚 Full Documentation

See `ADMIN_PANEL_GUIDE.md` for complete documentation.

## ✅ You're Ready!

The admin panel is fully functional and ready to use. Enjoy! 🎉
