import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin user
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.customer.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('12345', 10);
    
    const admin = await prisma.customer.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        status: 'active'
      }
    });

    console.log('✅ Default admin created:', admin.email);
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
