# Authentication System Guide

## Overview

This application now includes a complete authentication system with customer-specific data access. Each customer can only see and manage their own data (pages, stores, product colors, media).

## Features

✅ **User Registration & Login**
- Secure password hashing with bcrypt
- JWT token-based authentication
- 7-day token expiration

✅ **Customer-Specific Data**
- Each customer sees only their own data
- Pages, Stores, Product Colors, and Media are filtered by customer
- Admin role can see all data

✅ **Protected API Routes**
- All data endpoints require authentication
- Automatic token validation
- Ownership verification on updates/deletes

## Database Schema Changes

### New Customer Model
```prisma
model Customer {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("customer")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  pages     Page[]
  stores    Store[]
  productColors ProductColor[]
  media     Media[]
}
```

### Updated Models
- `Page` - Added `customerId` field
- `Store` - Added `customerId` field
- `ProductColor` - Added `customerId` field
- `Media` - Added `customerId` field

## Setup Instructions

### 1. Install Dependencies
```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### 2. Run Setup Script
```bash
./setup-auth.sh
```

This will:
- Generate Prisma client
- Push schema to database
- Create test customers

### 3. Manual Setup (Alternative)
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed test customers
npx tsx prisma/seed-customers.ts
```

## Test Credentials

### Primary Test Account (All Current Data)
- **Email:** test@gmail.com
- **Password:** 12345
- **Role:** customer
- **Data:** All existing pages, stores, product colors, and media

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** admin (can see all data)

### Additional Customer Accounts
- **Customer 1:**
  - Email: customer1@example.com
  - Password: customer123
  
- **Customer 2:**
  - Email: customer2@example.com
  - Password: customer123

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

Response:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "customer"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "customer"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "role": "customer",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Protected Endpoints

All data endpoints now require authentication:

```http
GET /api/pages
Authorization: Bearer <token>
```

The token is automatically included by the frontend after login.

## Frontend Integration

### Login Flow
1. User enters email and password
2. Frontend calls `/api/auth/login`
3. Token is stored in localStorage
4. Token is added to all API requests via axios interceptor
5. User is redirected to dashboard

### Logout Flow
1. User clicks logout button
2. Token is removed from localStorage
3. User is redirected to login page

### Auto-Authentication
- On app load, the frontend checks for existing token
- If valid token exists, user is automatically logged in
- If token is invalid/expired, user is redirected to login

## Security Features

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 10
- Plain text passwords are never stored

### Token Security
- JWT tokens expire after 7 days
- Tokens include user ID, email, and role
- Secret key should be changed in production (JWT_SECRET env variable)

### API Security
- All data endpoints require valid JWT token
- Ownership is verified before updates/deletes
- Admin role can access all data
- Regular customers can only access their own data

## Data Isolation

### Customer Data
When a customer logs in, they can only:
- View their own pages
- Create/edit/delete their own pages
- View their own stores
- Create/edit/delete their own stores
- View their own product colors
- Create/edit/delete their own product colors
- View their own media
- Upload media (automatically assigned to them)

### Admin Data
When an admin logs in, they can:
- View all pages from all customers
- View all stores from all customers
- View all product colors from all customers
- View all media from all customers
- Manage any data

## Environment Variables

Add to your `.env` file:

```env
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

⚠️ **Important:** Change the JWT_SECRET in production to a strong, random string.

## Testing the System

### Test Customer Isolation
1. Login as customer1@example.com
2. Create a page, store, or product color
3. Logout
4. Login as customer2@example.com
5. Verify you cannot see customer1's data
6. Create your own data
7. Logout
8. Login as admin@example.com
9. Verify you can see data from both customers

### Test API Protection
1. Try accessing `/api/pages` without token → Should get 401 error
2. Try accessing with invalid token → Should get 403 error
3. Try accessing with valid token → Should get data

## Troubleshooting

### "Access token required" error
- Make sure you're logged in
- Check if token exists in localStorage
- Try logging out and logging in again

### "Invalid or expired token" error
- Token has expired (7 days)
- Token is corrupted
- JWT_SECRET has changed
- Solution: Logout and login again

### Cannot see data after login
- Check browser console for errors
- Verify token is being sent in Authorization header
- Check server logs for authentication errors

### Database errors
- Run `npx prisma db push` to sync schema
- Run `npx prisma generate` to regenerate client
- Check DATABASE_URL in .env

## Production Deployment

Before deploying to production:

1. **Change JWT_SECRET**
   ```env
   JWT_SECRET="use-a-strong-random-string-here"
   ```

2. **Update CORS settings**
   - Set ALLOWED_ORIGINS to your production domain
   - Remove '*' wildcard

3. **Enable HTTPS**
   - JWT tokens should only be transmitted over HTTPS

4. **Set secure token expiration**
   - Consider shorter expiration for sensitive data
   - Implement refresh tokens for better UX

5. **Add rate limiting**
   - Protect login endpoint from brute force attacks
   - Use express-rate-limit or similar

## Future Enhancements

Potential improvements:
- [ ] Refresh token mechanism
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Activity logging
- [ ] Role-based permissions (beyond admin/customer)
- [ ] Team/organization support
- [ ] API rate limiting
- [ ] Account lockout after failed attempts

## Support

For issues or questions:
1. Check server logs for errors
2. Check browser console for frontend errors
3. Verify database connection
4. Ensure all dependencies are installed
5. Try running setup script again
