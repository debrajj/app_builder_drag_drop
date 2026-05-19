import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding A-Z complete suite of 4 prebuilt pages...');

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

  // Helper to parse dates
  const parseDate = (val: any) => {
    if (!val) return new Date();
    if (typeof val === 'number') return new Date(val);
    return new Date(val);
  };

  // ==========================================
  // PAGE 1: Home Page (from db.json)
  // ==========================================
  console.log('🏗️ Seeding Page 1: Home Page (from db.json)...');
  const dbJson = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  const homeData = dbJson.pages?.[0];
  if (homeData) {
    const createdPage = await prisma.page.create({
      data: {
        id: homeData.id || 'home-page-id',
        name: homeData.name,
        slug: homeData.slug,
        status: homeData.status || 'published',
        createdAt: parseDate(homeData.createdAt),
        updatedAt: parseDate(homeData.updatedAt),
        logo: homeData.logo || null,
        additionalData: homeData.additionalData || null,
        customerId: testUser.id
      }
    });

    for (const group of homeData.collectionGroups || []) {
      const createdGroup = await prisma.collectionGroup.create({
        data: {
          id: group.id,
          name: group.name,
          style: group.style,
          backgroundImage: group.backgroundImage || null,
          reference: group.reference || null,
          additionalData: group.additionalData || null,
          status: group.status || 'published',
          order: group.order || 0,
          pageId: createdPage.id
        }
      });

      for (const col of group.collections || []) {
        const createdCol = await prisma.collection.create({
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
            groupId: createdGroup.id
          }
        });

        for (const item of col.items || []) {
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
              media: item.imageUrl || item.media || null,
              additionalData: item.additionalData || null,
              reference: item.reference || null,
              navigation: item.navigation || null,
              button: item.button || null,
              status: item.status || 'published',
              order: item.order || 0,
              collectionId: createdCol.id
            }
          });
        }
      }
    }
    console.log('✅ Page 1: Home Page successfully seeded!');
  }

  // ==========================================
  // PAGES 2 & 3: Style Showcase & Banaclub (from compare-data.json)
  // ==========================================
  console.log('🏗️ Seeding Page 2 & 3: Style Showcase & Banaclub (from compare-data.json)...');
  const compareData = JSON.parse(fs.readFileSync('compare-data.json', 'utf8'));

  const pageKeys = ['showcase', 'banaclub'];
  for (const key of pageKeys) {
    const pageData = compareData[key];
    if (pageData) {
      console.log(`  Seeding page: "${pageData.name}" (${pageData.slug})...`);
      const createdPage = await prisma.page.create({
        data: {
          id: pageData.id,
          name: pageData.name,
          slug: pageData.slug,
          status: pageData.status || 'published',
          createdAt: parseDate(pageData.createdAt),
          updatedAt: parseDate(pageData.updatedAt),
          logo: pageData.logo || null,
          additionalData: pageData.additionalData || null,
          customerId: testUser.id
        }
      });

      for (const group of pageData.collectionGroups || []) {
        const createdGroup = await prisma.collectionGroup.create({
          data: {
            id: group.id,
            name: group.name,
            style: group.style,
            backgroundImage: group.backgroundImage || null,
            reference: group.reference || null,
            additionalData: typeof group.additionalData === 'object' ? JSON.stringify(group.additionalData) : group.additionalData || null,
            status: group.status || 'published',
            order: group.order || 0,
            pageId: createdPage.id
          }
        });

        for (const col of group.collections || []) {
          const createdCol = await prisma.collection.create({
            data: {
              id: col.id,
              name: col.name,
              link: col.link || null,
              shopifyId: col.shopifyId || null,
              collectionType: col.collectionType || null,
              isScrollable: Boolean(col.isScrollable),
              style: col.style,
              horizontal: Boolean(col.horizontal),
              additionalData: typeof col.additionalData === 'object' ? JSON.stringify(col.additionalData) : col.additionalData || null,
              navigation: typeof col.navigation === 'object' ? JSON.stringify(col.navigation) : col.navigation || null,
              image: col.image || null,
              column: col.column || null,
              button: typeof col.button === 'object' ? JSON.stringify(col.button) : col.button || null,
              collectionFilters: typeof col.collectionFilters === 'object' ? JSON.stringify(col.collectionFilters) : col.collectionFilters || null,
              status: col.status || 'published',
              order: col.order || 0,
              groupId: createdGroup.id
            }
          });

          for (const item of col.items || []) {
            await prisma.collectionItem.create({
              data: {
                id: item.id,
                name: item.name,
                images: typeof item.images === 'object' ? JSON.stringify(item.images) : item.images || null,
                text1: item.text1 || null,
                text2: item.text2 || null,
                text3: item.text3 || null,
                link: item.link || null,
                shopifyId: item.shopifyId || null,
                style: item.style,
                media: item.media || null,
                additionalData: typeof item.additionalData === 'object' ? JSON.stringify(item.additionalData) : item.additionalData || null,
                reference: item.reference || null,
                navigation: typeof item.navigation === 'object' ? JSON.stringify(item.navigation) : item.navigation || null,
                button: typeof item.button === 'object' ? JSON.stringify(item.button) : item.button || null,
                status: item.status || 'published',
                order: item.order || 0,
                collectionId: createdCol.id
              }
            });
          }
        }
      }
      console.log(`  ✅ Page "${pageData.name}" successfully seeded!`);
    }
  }

  // ==========================================
  // PAGE 4: Technoboost Demo Page (Jewelry)
  // ==========================================
  console.log('🏗️ Seeding Page 4: Technoboost Demo Page (demo-page)...');
  const demoPageId = 'demo-page-uuid';
  await prisma.page.create({
    data: {
      id: demoPageId,
      name: 'Technoboost Demo Page',
      slug: 'demo-page',
      status: 'published',
      logo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200',
      customerId: testUser.id
    }
  });

  // Hero Slider
  const heroGroupId = 'demo-hero-group-id';
  await prisma.collectionGroup.create({
    data: {
      id: heroGroupId,
      name: 'Hero Showcase',
      style: 'HERO_SLIDER_SECTION',
      status: 'published',
      order: 0,
      pageId: demoPageId
    }
  });

  const heroColId = 'demo-hero-col-id';
  await prisma.collection.create({
    data: {
      id: heroColId,
      name: 'Hero Banner Collection',
      style: 'HERO_SLIDER_COLLECTION',
      status: 'published',
      order: 0,
      groupId: heroGroupId
    }
  });

  await prisma.collectionItem.create({
    data: {
      id: 'demo-hero-item-1',
      name: 'Discover Fine Jewelry',
      text1: 'Handcrafted masterpieces that express elegance and grace.',
      text2: 'Explore our latest collections online today.',
      button: 'Shop The Collection',
      media: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      style: 'HERO_SLIDER_COLLECTION_ITEM',
      status: 'published',
      order: 0,
      collectionId: heroColId
    }
  });

  // Featured Grid
  const gridGroupId = 'demo-grid-group-id';
  await prisma.collectionGroup.create({
    data: {
      id: gridGroupId,
      name: 'Trending Products',
      style: 'GRID_SECTION',
      status: 'published',
      order: 1,
      pageId: demoPageId
    }
  });

  const gridColId = 'demo-grid-col-id';
  await prisma.collection.create({
    data: {
      id: gridColId,
      name: 'Trending Jewelry items',
      style: 'GRID_COLLECTION',
      status: 'published',
      order: 0,
      groupId: gridGroupId
    }
  });

  const jewelryItems = [
    {
      id: 'demo-item-1',
      name: 'Sterling Silver Promise Ring',
      text1: '$129.00',
      media: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
      order: 0
    },
    {
      id: 'demo-item-2',
      name: 'Gold Eternity Necklace',
      text1: '$349.00',
      media: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
      order: 1
    },
    {
      id: 'demo-item-3',
      name: 'Diamond Stud Earrings',
      text1: '$499.00',
      media: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400',
      order: 2
    },
    {
      id: 'demo-item-4',
      name: 'Rose Gold Chain Bracelet',
      text1: '$189.00',
      media: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400',
      order: 3
    }
  ];

  for (const item of jewelryItems) {
    await prisma.collectionItem.create({
      data: {
        id: item.id,
        name: item.name,
        text1: item.text1,
        media: item.media,
        style: 'GRID_COLLECTION_ITEM',
        status: 'published',
        order: item.order,
        collectionId: gridColId
      }
    });
  }
  console.log('✅ Page 4: Technoboost Demo Page successfully seeded!');

  // ==========================================
  // 5. Seed GlobalSettings, GlobalStyles, Stores, Colors (from SQLite Dump)
  // ==========================================
  console.log('🏗️ Seeding metadata and globals from SQLite dump...');
  const dump = JSON.parse(fs.readFileSync('sqlite-dump.json', 'utf8'));

  // GlobalSettings
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

  // GlobalStyles
  for (const style of dump.GlobalStyle || []) {
    await prisma.globalStyle.create({
      data: {
        id: style.id,
        styleList: style.styleList
      }
    });
  }

  // Stores
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

  // ProductColors
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

  console.log('🎉 Seed complete! All 4 pages ("Home Page", "Style Showcase", "Banana Club", and "Technoboost Demo Page") are successfully active.');
}

main()
  .catch((e) => {
    console.error('❌ Error during complete seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
