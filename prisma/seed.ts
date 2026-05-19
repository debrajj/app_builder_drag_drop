import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding comprehensive database pages...');

  // 1. Create default users
  const adminEmail = 'admin@example.com';
  const testEmail = 'test@gmail.com';
  const hashedPassword = await bcrypt.hash('12345', 10);

  // Admin User
  const admin = await prisma.customer.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      status: 'active'
    }
  });
  console.log('✅ Admin user ready:', admin.email);

  // Test User
  const testUser = await prisma.customer.upsert({
    where: { email: testEmail },
    update: { password: hashedPassword },
    create: {
      email: testEmail,
      password: hashedPassword,
      name: 'Test User',
      role: 'customer',
      status: 'active'
    }
  });
  console.log('✅ Test user ready:', testUser.email);

  // 2. Clean up existing database pages, groups, collections, and items to start clean
  await prisma.collectionItem.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.collectionGroup.deleteMany({});
  await prisma.page.deleteMany({});
  console.log('🗑️ Cleaned up existing pages, groups, collections, and items');

  // Helper to load and create pages from compare-data.json
  let snapshot: any = {};
  try {
    const raw = fs.readFileSync('compare-data.json', 'utf8');
    snapshot = JSON.parse(raw);
    console.log('📖 Loaded compare-data.json snapshot successfully');
  } catch (err) {
    console.warn('⚠️ Could not load compare-data.json. Will fall back to standard seeds.');
  }

  // Define the pages to seed
  const pagesToSeed = [
    { key: 'showcase', defaultSlug: 'showcase', defaultName: 'Style Showcase' },
    { key: 'banaclub', defaultSlug: 'banaclub', defaultName: 'Banana Club' }
  ];

  for (const pageInfo of pagesToSeed) {
    const data = snapshot[pageInfo.key];
    if (data) {
      console.log(`🏗️ Seeding page: "${data.name}" (${data.slug}) from snapshot...`);
      
      const createdPage = await prisma.page.create({
        data: {
          name: data.name || pageInfo.defaultName,
          slug: data.slug || pageInfo.defaultSlug,
          status: data.status || 'published',
          logo: data.logo || null,
          additionalData: data.additionalData ? (typeof data.additionalData === 'string' ? data.additionalData : JSON.stringify(data.additionalData)) : null,
          customerId: testUser.id // Owned by test user so they show up for them too
        }
      });

      if (data.collectionGroups && Array.isArray(data.collectionGroups)) {
        for (const group of data.collectionGroups) {
          const createdGroup = await prisma.collectionGroup.create({
            data: {
              name: group.name,
              style: group.style || 'DEFAULT',
              backgroundImage: group.backgroundImage || null,
              reference: group.reference || null,
              additionalData: group.additionalData ? (typeof group.additionalData === 'string' ? group.additionalData : JSON.stringify(group.additionalData)) : null,
              status: group.status || 'published',
              order: group.order || 0,
              pageId: createdPage.id
            }
          });

          if (group.collections && Array.isArray(group.collections)) {
            for (const collection of group.collections) {
              const createdCollection = await prisma.collection.create({
                data: {
                  name: collection.name,
                  link: collection.link || null,
                  shopifyId: collection.shopifyId || null,
                  collectionType: collection.collectionType || null,
                  isScrollable: collection.isScrollable || false,
                  style: collection.style || 'DEFAULT',
                  horizontal: collection.horizontal || false,
                  additionalData: collection.additionalData ? (typeof collection.additionalData === 'string' ? collection.additionalData : JSON.stringify(collection.additionalData)) : null,
                  navigation: collection.navigation ? (typeof collection.navigation === 'string' ? collection.navigation : JSON.stringify(collection.navigation)) : null,
                  image: collection.image || null,
                  column: collection.column || null,
                  button: collection.button || null,
                  collectionFilters: collection.collectionFilters ? (typeof collection.collectionFilters === 'string' ? collection.collectionFilters : JSON.stringify(collection.collectionFilters)) : null,
                  status: collection.status || 'published',
                  order: collection.order || 0,
                  groupId: createdGroup.id
                }
              });

              if (collection.items && Array.isArray(collection.items)) {
                for (const item of collection.items) {
                  await prisma.collectionItem.create({
                    data: {
                      name: item.name,
                      images: item.images ? (typeof item.images === 'string' ? item.images : JSON.stringify(item.images)) : null,
                      text1: item.text1 || null,
                      text2: item.text2 || null,
                      text3: item.text3 || null,
                      link: item.link || null,
                      shopifyId: item.shopifyId || null,
                      style: item.style || 'DEFAULT',
                      media: item.media || null,
                      additionalData: item.additionalData ? (typeof item.additionalData === 'string' ? item.additionalData : JSON.stringify(item.additionalData)) : null,
                      reference: item.reference || null,
                      navigation: item.navigation ? (typeof item.navigation === 'string' ? item.navigation : JSON.stringify(item.navigation)) : null,
                      button: item.button || null,
                      status: item.status || 'published',
                      order: item.order || 0,
                      collectionId: createdCollection.id
                    }
                  });
                }
              }
            }
          }
        }
      }
      console.log(`✅ Page "${createdPage.name}" successfully seeded!`);
    } else {
      console.log(`ℹ️ Page key "${pageInfo.key}" not found in snapshot. Skipping...`);
    }
  }

  // 3. Create Technoboost Demo Page (the 3rd page)
  console.log('🏗️ Creating Technoboost Demo Page...');
  const demoPage = await prisma.page.create({
    data: {
      name: 'Technoboost Demo Page',
      slug: 'demo-page',
      status: 'published',
      customerId: testUser.id
    }
  });

  const demoGroup = await prisma.collectionGroup.create({
    data: {
      name: 'Dynamic Showcase Section',
      reference: 'dynamic-showcase',
      style: 'TAB_SECTION',
      status: 'published',
      order: 0,
      pageId: demoPage.id
    }
  });

  const demoCollection = await prisma.collection.create({
    data: {
      name: 'Featured Jewelry Tab',
      style: 'TAB_COLLECTION',
      collectionType: 'REC',
      status: 'published',
      order: 0,
      groupId: demoGroup.id
    }
  });

  const demoItems = [
    { name: 'Demo Silver Ring', reference: 'demo-ring-1', text1: '92.5 Silver Ring', text2: 'Handcrafted', text3: '$45.00', style: 'DEFAULT', media: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800', status: 'published' },
    { name: 'Demo Gold Necklace', reference: 'demo-neck-1', text1: '18k Gold Necklace', text2: 'Elegant Design', text3: '$120.00', style: 'DEFAULT', media: 'https://images.unsplash.com/photo-1599643478514-4a11011c086e?q=80&w=800', status: 'published' },
    { name: 'Demo Diamond Earrings', reference: 'demo-ear-1', text1: 'Diamond Studs', text2: 'Premium Cut', text3: '$250.00', style: 'DEFAULT', media: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800', status: 'published' }
  ];

  for (let i = 0; i < demoItems.length; i++) {
    await prisma.collectionItem.create({
      data: {
        ...demoItems[i],
        order: i,
        collectionId: demoCollection.id
      }
    });
  }
  console.log('✅ Technoboost Demo Page successfully seeded!');

  console.log('🎉 Seed complete! All 3 pages ("Style Showcase", "Banana Club", and "Technoboost Demo Page") are ready.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
