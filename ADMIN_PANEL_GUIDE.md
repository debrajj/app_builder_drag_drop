# Admin Panel Guide

## Overview
A comprehensive admin panel for managing users and administrators with role-based access control.

## Features

### 1. Admin Login
- **URL**: `/admin/login`
- **Demo Credentials**:
  - Email: `admin@example.com`
  - Password: `12345`
- Secure JWT-based authentication
- Role verification (admin only)
- Account status checking

### 2. Dashboard
- **URL**: `/admin/dashboard`
- **Statistics Cards**:
  - Total Users
  - Active Users
  - Inactive Users
  - Total Admins
  - Recent Users (last 7 days)
- **Recent Users Table**:
  - Shows last 10 registered users
  - Displays name, email, status, registration date, and last login

### 3. User Management
- **URL**: `/admin/users`
- **Features**:
  - View all users in paginated table
  - Search by name or email
  - Filter by status (active/inactive/suspended)
  - Filter by role (user/admin)
  - Add new users
  - Edit existing users
  - Delete users
  - Toggle user status (active/inactive)
  - Reset user passwords
- **User Fields**:
  - Name
  - Email
  - Password
  - Phone (optional)
  - Role (User/Admin)
  - Status (Active/Inactive/Suspended)

### 4. Admin Management
- **URL**: `/admin/admins`
- **Features**:
  - View all admin accounts
  - Create new admin accounts
  - Display admin details (name, email, phone, status, last login)
- **Admin Fields**:
  - Name
  - Email
  - Password
  - Phone (optional)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Update Database Schema
```bash
npx prisma db push
```

### 3. Seed Default Admin
```bash
npx prisma db seed
```

This will create the default admin account:
- Email: `admin@example.com`
- Password: `12345`

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access Admin Panel
Navigate to: `http://localhost:3000/admin/login`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (tracks lastLogin)
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/recent-users` - Get recent users

### User Management
- `GET /api/admin/users` - List all users (with pagination, search, filters)
- `GET /api/admin/users/:id` - Get single user
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/reset-password` - Reset user password
- `PATCH /api/admin/users/:id/status` - Toggle user status

### Admin Management
- `GET /api/admin/admins` - List all admins
- `POST /api/admin/admins` - Create new admin

## Database Schema Updates

### Customer Model
Added new fields:
- `status` - User account status (active/inactive/suspended)
- `phone` - Optional phone number
- `lastLogin` - Timestamp of last login

## Security Features

1. **JWT Authentication**: All admin routes require valid JWT token
2. **Role-Based Access**: Admin routes check for admin role
3. **Password Hashing**: bcrypt with salt rounds
4. **Account Status**: Inactive/suspended users cannot login
5. **Self-Protection**: Admins cannot delete their own account

## UI Features

1. **Responsive Design**: Works on desktop and mobile
2. **Modern UI**: Clean, professional interface with Tailwind CSS
3. **Interactive Tables**: Sortable, searchable, filterable
4. **Modal Forms**: Add/Edit users in modal dialogs
5. **Toast Notifications**: Success/error feedback
6. **Loading States**: Spinners and disabled states
7. **Status Badges**: Color-coded status indicators
8. **Collapsible Sidebar**: Space-efficient navigation

## User Roles

### Admin
- Full access to admin panel
- Can manage all users and admins
- Can view all data regardless of ownership

### Customer (User)
- No admin panel access
- Can only access their own data
- Standard application features

## Status Types

1. **Active**: User can login and use the system
2. **Inactive**: User account is disabled, cannot login
3. **Suspended**: User account is temporarily suspended

## Best Practices

1. **Change Default Password**: Update the default admin password immediately
2. **Regular Backups**: Backup user data regularly
3. **Monitor Activity**: Check dashboard stats regularly
4. **User Privacy**: Handle user data responsibly
5. **Strong Passwords**: Enforce minimum 5 characters (increase in production)

## Troubleshooting

### Cannot Login
- Verify credentials are correct
- Check user status is "active"
- Verify user role is "admin"
- Check JWT_SECRET is set in environment

### Database Errors
- Run `npx prisma db push` to sync schema
- Run `npx prisma generate` to regenerate client
- Check DATABASE_URL in .env

### Missing Admin User
- Run `npx prisma db seed` to create default admin
- Or manually create admin via database

## Future Enhancements

Potential features to add:
- Activity logs and audit trail
- Bulk user operations
- Email notifications
- Password reset via email
- Two-factor authentication
- Advanced analytics
- Export user data
- User groups/permissions
- Session management
- IP whitelisting

## Support

For issues or questions, check:
1. Console logs for errors
2. Network tab for API failures
3. Database connection status
4. Environment variables configuration
