import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding customers...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.customer.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin'
    }
  });
  console.log('Created admin:', admin.email);

  // Create test customer 1
  const customer1Password = await bcrypt.hash('customer123', 10);
  const customer1 = await prisma.customer.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      email: 'customer1@example.com',
      password: customer1Password,
      name: 'Customer One',
      role: 'customer'
    }
  });
  console.log('Created customer:', customer1.email);

  // Create test customer 2
  const customer2Password = await bcrypt.hash('customer123', 10);
  const customer2 = await prisma.customer.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      email: 'customer2@example.com',
      password: customer2Password,
      name: 'Customer Two',
      role: 'customer'
    }
  });
  console.log('Created customer:', customer2.email);

  console.log('Seeding completed!');
  console.log('\nTest Credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Customer 1: customer1@example.com / customer123');
  console.log('Customer 2: customer2@example.com / customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
