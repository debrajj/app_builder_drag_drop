import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({ where: { slug: 'bananaclub' } });
  if (!page) return;

  console.log('🦶 Adding Footer to Banana Club...');

  await prisma.collectionGroup.create({
    data: {
      name: 'Footer',
      style: 'FOOTER_SECTION',
      status: 'published',
      order: 5,
      pageId: page.id,
      collections: {
        create: {
          name: 'Footer Links',
          style: 'FOOTER_COLLECTION',
          status: 'published',
          order: 0,
          items: {
            create: [
              { name: 'About Us', style: 'FOOTER_COLLECTION_ITEM', order: 0, status: 'published' },
              { name: 'Contact Us', style: 'FOOTER_COLLECTION_ITEM', order: 1, status: 'published' },
              { name: 'Shipping Policy', style: 'FOOTER_COLLECTION_ITEM', order: 2, status: 'published' },
              { name: 'Refund Policy', style: 'FOOTER_COLLECTION_ITEM', order: 3, status: 'published' }
            ]
          }
        }
      }
    }
  });

  console.log('✅ Footer added!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
