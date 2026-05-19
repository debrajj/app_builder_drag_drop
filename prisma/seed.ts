import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding A-Z prebuilt database from SQLite dump...');

  // 1. Create Default Users
  const adminEmail = 'admin@example.com';
  const testEmail = 'test@gmail.com';
  const hashedPassword = await bcrypt.hash('12345', 10);

  // Admin
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

  // 2. Clean up existing tables
  await prisma.collectionItem.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.collectionGroup.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.globalSetting.deleteMany({});
  await prisma.globalStyle.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.productColor.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.homeShopPage.deleteMany({});
  console.log('🗑️ Cleaned up existing database tables');

  // 3. Load SQLite Dump JSON
  const raw = fs.readFileSync('sqlite-dump.json', 'utf8');
  const dump = JSON.parse(raw);
  console.log('📖 Loaded sqlite-dump.json successfully');

  // Helper to parse dates
  const parseDate = (val: any) => {
    if (!val) return new Date();
    if (typeof val === 'number') return new Date(val);
    return new Date(val);
  };

  // 4. Seed Pages
  console.log('🏗️ Seeding Page...');
  for (const page of dump.Page || []) {
    await prisma.page.create({
      data: {
        id: page.id,
        name: page.name,
        slug: page.slug,
        status: page.status || 'published',
        createdAt: parseDate(page.createdAt),
        updatedAt: parseDate(page.updatedAt),
        logo: page.logo || null,
        additionalData: page.additionalData || null,
        customerId: testUser.id // Associated with the test user so they show up for them
      }
    });
  }
  console.log(`✅ Seeded ${dump.Page?.length || 0} pages`);

  // 5. Seed CollectionGroups
  console.log('🏗️ Seeding CollectionGroups...');
  for (const group of dump.CollectionGroup || []) {
    await prisma.collectionGroup.create({
      data: {
        id: group.id,
        name: group.name,
        style: group.style,
        backgroundImage: group.backgroundImage || null,
        reference: group.reference || null,
        additionalData: group.additionalData || null,
        status: group.status || 'published',
        order: group.order || 0,
        pageId: group.pageId
      }
    });
  }
  console.log(`✅ Seeded ${dump.CollectionGroup?.length || 0} collection groups`);

  // 6. Seed Collections
  console.log('🏗️ Seeding Collections...');
  for (const col of dump.Collection || []) {
    await prisma.collection.create({
      data: {
        id: col.id,
        name: col.name,
        link: col.link || null,
        shopifyId: col.shopifyId || null,
        collectionType: col.collectionType || null,
        isScrollable: Boolean(col.isScrollable),
        style: col.style,
        horizontal: Boolean(col.horizontal),
        additionalData: col.additionalData || null,
        navigation: col.navigation || null,
        image: col.image || null,
        column: col.column || null,
        button: col.button || null,
        collectionFilters: col.collectionFilters || null,
        status: col.status || 'published',
        order: col.order || 0,
        groupId: col.groupId
      }
    });
  }
  console.log(`✅ Seeded ${dump.Collection?.length || 0} collections`);

  // 7. Seed CollectionItems
  console.log('🏗️ Seeding CollectionItems...');
  for (const item of dump.CollectionItem || []) {
    await prisma.collectionItem.create({
      data: {
        id: item.id,
        name: item.name,
        images: item.images || null,
        text1: item.text1 || null,
        text2: item.text2 || null,
        text3: item.text3 || null,
        link: item.link || null,
        shopifyId: item.shopifyId || null,
        style: item.style,
        media: item.media || null,
        additionalData: item.additionalData || null,
        reference: item.reference || null,
        navigation: item.navigation || null,
        button: item.button || null,
        status: item.status || 'published',
        order: item.order || 0,
        collectionId: item.collectionId
      }
    });
  }
  console.log(`✅ Seeded ${dump.CollectionItem?.length || 0} collection items`);

  // 8. Seed GlobalSettings
  console.log('🏗️ Seeding GlobalSettings...');
  for (const setting of dump.GlobalSetting || []) {
    await prisma.globalSetting.create({
      data: {
        id: setting.id,
        offers: setting.offers || null,
        bestSellerTag: setting.bestSellerTag || null,
        newArrivalTag: setting.newArrivalTag || null,
        sellingFastTag: setting.sellingFastTag || null,
        bigSaveBasedOnValue: setting.bigSaveBasedOnValue || null,
        productLabelTheme: setting.productLabelTheme || null,
        wishlist: Boolean(setting.wishlist),
        productDetailTag: setting.productDetailTag || null,
        tagPriority: setting.tagPriority || null,
        sellingFastQTY: setting.sellingFastQTY || null,
        appForceUpdateVersion: setting.appForceUpdateVersion || null,
        appNewVersion: setting.appNewVersion || null,
        androidForceUpdateVersion: setting.androidForceUpdateVersion || null,
        androidNewVersion: setting.androidNewVersion || null,
        iosForceUpdateVersion: setting.iosForceUpdateVersion || null,
        iosNewVersion: setting.iosNewVersion || null
      }
    });
  }
  console.log(`✅ Seeded ${dump.GlobalSetting?.length || 0} global settings`);

  // 9. Seed GlobalStyles
  console.log('🏗️ Seeding GlobalStyles...');
  for (const style of dump.GlobalStyle || []) {
    await prisma.globalStyle.create({
      data: {
        id: style.id,
        styleList: style.styleList
      }
    });
  }
  console.log(`✅ Seeded ${dump.GlobalStyle?.length || 0} global styles`);

  // 10. Seed Stores
  console.log('🏗️ Seeding Stores...');
  for (const store of dump.Store || []) {
    await prisma.store.create({
      data: {
        id: store.id,
        name: store.name,
        address: store.address || null,
        contactUs: store.contactUs || null,
        direction: store.direction || null,
        latitude: store.latitude || null,
        longitude: store.longitude || null,
        city: store.city || null,
        state: store.state || null,
        image: store.image || null,
        rating: store.rating || null,
        ratingUser: store.ratingUser || null,
        openingTime: store.openingTime || null,
        closingTime: store.closingTime || null,
        storePosition: store.storePosition || 0,
        isPopular: Boolean(store.isPopular),
        status: store.status || 'published',
        customerId: admin.id
      }
    });
  }
  console.log(`✅ Seeded ${dump.Store?.length || 0} stores`);

  // 11. Seed ProductColors
  console.log('🏗️ Seeding ProductColors...');
  for (const color of dump.ProductColor || []) {
    await prisma.productColor.create({
      data: {
        id: color.id,
        colorName: color.colorName,
        colorCode: color.colorCode || null,
        imageUrl: color.imageUrl || null,
        imageName: color.imageName || null,
        colorType: color.colorType || 'Color',
        customerId: admin.id
      }
    });
  }
  console.log(`✅ Seeded ${dump.ProductColor?.length || 0} product colors`);

  console.log('🎉 Database seeding complete! All SQLite prebuilt data successfully migrated to PostgreSQL.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
