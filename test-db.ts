import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test 1: Check Pages
    const pages = await prisma.page.findMany();
    console.log(`✅ Pages: Found ${pages.length} page(s)`);
    if (pages.length > 0) {
      console.log(`   - First page: "${pages[0].name}" (${pages[0].slug})`);
    }

    // Test 2: Check Stores
    const stores = await prisma.store.findMany();
    console.log(`✅ Stores: Found ${stores.length} store(s)`);
    if (stores.length > 0) {
      console.log(`   - First store: "${stores[0].name}"`);
    }

    // Test 3: Check Global Settings
    const globalSettings = await prisma.globalSetting.findMany();
    console.log(`✅ Global Settings: Found ${globalSettings.length} record(s)`);

    // Test 4: Check Global Styles
    const globalStyles = await prisma.globalStyle.findMany();
    console.log(`✅ Global Styles: Found ${globalStyles.length} record(s)`);

    // Test 5: Check Product Colors
    const productColors = await prisma.productColor.findMany();
    console.log(`✅ Product Colors: Found ${productColors.length} color(s)`);

    // Test 6: Check Media
    const media = await prisma.media.findMany();
    console.log(`✅ Media: Found ${media.length} media item(s)`);

    // Test 7: Check Collection Groups
    const collectionGroups = await prisma.collectionGroup.findMany();
    console.log(`✅ Collection Groups: Found ${collectionGroups.length} group(s)`);

    // Test 8: Check Collections
    const collections = await prisma.collection.findMany();
    console.log(`✅ Collections: Found ${collections.length} collection(s)`);

    // Test 9: Check Collection Items
    const collectionItems = await prisma.collectionItem.findMany();
    console.log(`✅ Collection Items: Found ${collectionItems.length} item(s)`);

    console.log('\n✨ Database is working properly!');
    console.log(`📊 Database: page_builder_app`);
    console.log(`🌐 Host: family-tree-db.cuafddu82hzq.ap-south-1.rds.amazonaws.com`);

  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
