import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Migrating all data to test@gmail.com...');
  console.log('');

  // Create test user
  const password = await bcrypt.hash('12345', 10);
  const testUser = await prisma.customer.upsert({
    where: { email: 'test@gmail.com' },
    update: {
      password: password,
      name: 'Test User'
    },
    create: {
      email: 'test@gmail.com',
      password: password,
      name: 'Test User',
      role: 'customer'
    }
  });
  console.log('✅ Created/Updated user: test@gmail.com');
  console.log('   User ID:', testUser.id);
  console.log('');

  // Update all pages
  const pagesUpdated = await prisma.page.updateMany({
    where: {
      OR: [
        { customerId: null },
        { customerId: { not: testUser.id } }
      ]
    },
    data: {
      customerId: testUser.id
    }
  });
  console.log(`✅ Updated ${pagesUpdated.count} pages`);

  // Update all stores
  const storesUpdated = await prisma.store.updateMany({
    where: {
      OR: [
        { customerId: null },
        { customerId: { not: testUser.id } }
      ]
    },
    data: {
      customerId: testUser.id
    }
  });
  console.log(`✅ Updated ${storesUpdated.count} stores`);

  // Update all product colors
  const colorsUpdated = await prisma.productColor.updateMany({
    where: {
      OR: [
        { customerId: null },
        { customerId: { not: testUser.id } }
      ]
    },
    data: {
      customerId: testUser.id
    }
  });
  console.log(`✅ Updated ${colorsUpdated.count} product colors`);

  // Update all media
  const mediaUpdated = await prisma.media.updateMany({
    where: {
      OR: [
        { customerId: null },
        { customerId: { not: testUser.id } }
      ]
    },
    data: {
      customerId: testUser.id
    }
  });
  console.log(`✅ Updated ${mediaUpdated.count} media items`);

  console.log('');
  console.log('🎉 Migration complete!');
  console.log('');
  console.log('📝 Login Credentials:');
  console.log('   Email: test@gmail.com');
  console.log('   Password: 12345');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - ${pagesUpdated.count} pages assigned`);
  console.log(`   - ${storesUpdated.count} stores assigned`);
  console.log(`   - ${colorsUpdated.count} product colors assigned`);
  console.log(`   - ${mediaUpdated.count} media items assigned`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
