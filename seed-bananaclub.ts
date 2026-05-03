import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🍌 Seeding Banana Club Page...');

  // Get test user
  const user = await prisma.customer.findUnique({
    where: { email: 'test@gmail.com' }
  });

  if (!user) {
    console.error('❌ User test@gmail.com not found. Run migrate-data-to-test-user.ts first.');
    return;
  }

  // Create Page
  const page = await prisma.page.upsert({
    where: { slug: 'bananaclub' },
    update: {
      name: 'Banana Club',
      status: 'published',
      customerId: user.id
    },
    create: {
      name: 'Banana Club',
      slug: 'bananaclub',
      status: 'published',
      customerId: user.id
    }
  });

  console.log(`✅ Page created: ${page.name} (${page.id})`);

  // Delete existing groups for this page to start fresh
  await prisma.collectionGroup.deleteMany({
    where: { pageId: page.id }
  });

  // 1. Hero Banners
  const heroGroup = await prisma.collectionGroup.create({
    data: {
      name: 'Hero Banners',
      style: 'BANNER_SECTION',
      status: 'published',
      order: 0,
      pageId: page.id,
      collections: {
        create: {
          name: 'Main Banners',
          style: 'BANNER_COLLECTION',
          status: 'published',
          order: 0,
          items: {
            create: [
              {
                name: 'Polo Shirts',
                style: 'BANNER_COLLECTION_ITEM',
                media: 'https://bananaclub.co.in/cdn/shop/files/polo_shirts_web_banner.webp?v=1776419515&width=3000',
                order: 0,
                status: 'published'
              },
              {
                name: 'Linen Shirts',
                style: 'BANNER_COLLECTION_ITEM',
                media: 'https://bananaclub.co.in/cdn/shop/files/linen_shirt_web_banner.webp?v=1776419694&width=3000',
                order: 1,
                status: 'published'
              }
            ]
          }
        }
      }
    }
  });
  console.log('✅ Added Hero Banners');

  // 2. Featured Categories
  const catGroup = await prisma.collectionGroup.create({
    data: {
      name: 'Featured Categories',
      style: 'GRID_SECTION',
      status: 'published',
      order: 1,
      pageId: page.id,
      collections: {
        create: {
          name: 'Categories',
          style: 'GRID_COLLECTION',
          status: 'published',
          order: 0,
          items: {
            create: [
              { name: 'New Drop', style: 'GRID_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/New_Drop_grid_Image.jpg?v=1767605574&width=1500', order: 0, status: 'published' },
              { name: 'Shirts', style: 'GRID_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/shirts_Grid_Image.jpg?v=1767605713&width=1500', order: 1, status: 'published' },
              { name: 'Bottoms', style: 'GRID_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/bottom_wear_grid_image.jpg?v=1767605821&width=1500', order: 2, status: 'published' },
              { name: 'T-Shirts', style: 'GRID_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/Tshirts_Grid_image.jpg?v=1767605901&width=1500', order: 3, status: 'published' },
              { name: 'Co-ords', style: 'GRID_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/Co-ord_set_Grid_Image.jpg?v=1767606032&width=1500', order: 4, status: 'published' },
              { name: 'Winter Wear', style: 'GRID_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/Winter_wear_grid_image.jpg?v=1767606216&width=1500', order: 5, status: 'published' }
            ]
          }
        }
      }
    }
  });
  console.log('✅ Added Featured Categories');

  // 3. Brand Story
  const storyGroup = await prisma.collectionGroup.create({
    data: {
      name: 'Brand Story',
      style: 'IMAGE_WITH_TEXT_SECTION',
      status: 'published',
      order: 2,
      pageId: page.id,
      collections: {
        create: {
          name: 'Story',
          style: 'IMAGE_WITH_TEXT_COLLECTION',
          status: 'published',
          order: 0,
          items: {
            create: [
              {
                name: 'Pitch to Get Rich',
                style: 'IMAGE_WITH_TEXT_COLLECTION_ITEM',
                media: 'https://bananaclub.co.in/cdn/shop/files/Banner_1600x399_ecfcca77-145b-4d72-b214-ff9596f4b19b.jpg?v=1761649620&width=1500',
                text1: 'OUR STORY. OUR JOURNEY.',
                text2: 'NOW STREAMING ON PITCH TO GET RICH - JIOHOTSTAR',
                order: 0,
                status: 'published'
              }
            ]
          }
        }
      }
    }
  });
  console.log('✅ Added Brand Story');

  // 4. Denim Collection
  const denimGroup = await prisma.collectionGroup.create({
    data: {
      name: 'Denim Collection',
      style: 'BANNER_SECTION',
      status: 'published',
      order: 3,
      pageId: page.id,
      collections: {
        create: {
          name: 'Denim',
          style: 'BANNER_COLLECTION',
          status: 'published',
          order: 0,
          items: {
            create: [
              {
                name: "It's All About Denim",
                style: 'BANNER_COLLECTION_ITEM',
                media: 'https://bananaclub.co.in/cdn/shop/files/Denims_website_banner.webp?v=1776419817&width=1500',
                order: 0,
                status: 'published'
              }
            ]
          }
        }
      }
    }
  });
  console.log('✅ Added Denim Collection');

  // 5. New Drop Products
  const productGroup = await prisma.collectionGroup.create({
    data: {
      name: 'New Drop New Life!',
      style: 'SLIDE_SECTION',
      status: 'published',
      order: 4,
      pageId: page.id,
      collections: {
        create: {
          name: 'Products',
          style: 'SLIDER_COLLECTION',
          status: 'published',
          order: 0,
          items: {
            create: [
              { name: 'Handcrafted Designer Shirt', style: 'SLIDER_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/WhiteBeadworkHandcraftedDesignerShirt_1.jpg?crop=center&height=1440&v=1777526640&width=1000', text1: '₹ 2,499', order: 0, status: 'published' },
              { name: 'Pure Linen Shirt', style: 'SLIDER_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/White_Pure_Linen_Shirt_1.jpg?crop=center&height=1440&v=1771325306&width=1000', text1: '₹ 1,999', order: 1, status: 'published' },
              { name: 'Gurkha Pant', style: 'SLIDER_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/DeepBlackGurkhaPant_2_df47f3a6-cfbc-4477-9f1c-477f30ba90c7.jpg?crop=center&height=1440&v=1770112657&width=1000', text1: '₹ 2,299', order: 2, status: 'published' },
              { name: 'Accordion Crinkled Kurta', style: 'SLIDER_COLLECTION_ITEM', media: 'https://bananaclub.co.in/cdn/shop/files/BlackAccordionCrinkledStripeKurta.jpg?crop=center&height=1440&v=1763361873&width=1000', text1: '₹ 1,799', order: 3, status: 'published' }
            ]
          }
        }
      }
    }
  });
  console.log('✅ Added New Drop Products');

  console.log('');
  console.log('🎉 Banana Club seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
