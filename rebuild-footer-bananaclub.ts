import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({ 
    where: { slug: 'bananaclub' },
    include: { collectionGroups: { where: { style: 'FOOTER_SECTION' } } }
  });
  
  if (!page) return;

  // Delete existing footer group if any
  if (page.collectionGroups.length > 0) {
    await prisma.collectionGroup.delete({ where: { id: page.collectionGroups[0].id } });
  }

  console.log('🏗️ Rebuilding Footer for Banana Club...');

  await prisma.collectionGroup.create({
    data: {
      name: 'Footer',
      style: 'FOOTER_SECTION',
      status: 'published',
      order: 10,
      pageId: page.id,
      collections: {
        create: {
          name: 'Footer Links',
          style: 'FOOTER_COLLECTION',
          status: 'published',
          order: 0,
          items: {
            create: [
              { 
                name: 'RESOURCES', 
                text1: 'About Us', 
                text2: 'Contact Us', 
                text3: 'Terms of Service', 
                style: 'FOOTER_COLLECTION_ITEM', 
                order: 0, 
                status: 'published' 
              },
              { 
                name: 'QUICK LINKS', 
                text1: 'Shipping Policy', 
                text2: 'Refund Policy', 
                text3: 'Privacy Policy', 
                style: 'FOOTER_COLLECTION_ITEM', 
                order: 1, 
                status: 'published' 
              },
              { 
                name: 'CONTACT US', 
                text1: '+91 1234567890', 
                text2: 'support@bananaclub.co.in', 
                text3: 'Follow us on Instagram', 
                style: 'FOOTER_COLLECTION_ITEM', 
                order: 2, 
                status: 'published' 
              },
              { 
                name: 'COPYRIGHT', 
                text1: '© 2024 Banana Club. All rights reserved.', 
                style: 'FOOTER_COLLECTION_ITEM', 
                order: 3, 
                status: 'published' 
              }
            ]
          }
        }
      }
    }
  });

  console.log('✅ Footer rebuilt with content!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
