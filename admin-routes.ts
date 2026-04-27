import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { authenticateToken, AuthRequest } from "./auth-middleware.js";

const router = Router();
const prisma = new PrismaClient();

// Middleware to check if user is admin
const requireAdmin = (req: AuthRequest, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Dashboard Stats
router.get("/dashboard/stats", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const totalUsers = await prisma.customer.count({ where: { role: 'customer' } });
    const totalAdmins = await prisma.customer.count({ where: { role: 'admin' } });
    const activeUsers = await prisma.customer.count({ where: { status: 'active', role: 'customer' } });
    const inactiveUsers = await prisma.customer.count({ where: { status: 'inactive', role: 'customer' } });
    
    // Recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await prisma.customer.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
        role: 'customer'
      }
    });

    res.json({
      totalUsers,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      recentUsers
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Recent Users for Dashboard
router.get("/dashboard/recent-users", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const users = await prisma.customer.findMany({
      where: { role: 'customer' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User Management - List all users
router.get("/users", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string || '';
    const role = req.query.role as string || '';

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          phone: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
router.get("/users/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.customer.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user
router.post("/users", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { email, password, name, role, status, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.customer.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'customer',
        status: status || 'active',
        phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put("/users/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, email, role, status, phone, password } = req.body;

    const updateData: any = {
      name,
      email,
      role,
      status,
      phone
    };

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.customer.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete("/users/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user!.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.customer.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reset user password
router.post("/users/:id/reset-password", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 5) {
      return res.status(400).json({ error: 'Password must be at least 5 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.customer.update({
      where: { id: req.params.id },
      data: { password: hashedPassword }
    });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle user status
router.patch("/users/:id/status", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await prisma.customer.update({
      where: { id: req.params.id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        status: true
      }
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Management - List all admins
router.get("/admins", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const admins = await prisma.customer.findMany({
      where: { role: 'admin' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        phone: true,
        lastLogin: true,
        createdAt: true
      }
    });

    res.json(admins);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new admin
router.post("/admins", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.customer.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        status: 'active',
        phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true
      }
    });

    res.json(admin);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
