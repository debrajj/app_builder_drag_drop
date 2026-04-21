import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addMedia() {
  console.log('Adding media items to database...');

  const mediaItems = [
    {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      name: 'store-interior-1.jpg',
      size: 245000,
      type: 'image/jpeg'
    },
    {
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
      name: 'fashion-banner-1.jpg',
      size: 312000,
      type: 'image/jpeg'
    },
    {
      url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800',
      name: 'winter-collection.jpg',
      size: 289000,
      type: 'image/jpeg'
    },
    {
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      name: 'product-tshirt.jpg',
      size: 156000,
      type: 'image/jpeg'
    },
    {
      url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      name: 'product-jeans.jpg',
      size: 178000,
      type: 'image/jpeg'
    },
    {
      url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
      name: 'product-sneakers.jpg',
      size: 198000,
      type: 'image/jpeg'
    },
    {
      url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      name: 'product-hoodie.jpg',
      size: 167000,
      type: 'image/jpeg'
    },
    {
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      name: 'product-jacket.jpg',
      size: 189000,
      type: 'image/jpeg'
    },
    {
      url: 'https://i.pravatar.cc/150?img=1',
      name: 'avatar-sarah.jpg',
      size: 12000,
      type: 'image/jpeg'
    },
    {
      url: 'https://i.pravatar.cc/150?img=2',
      name: 'avatar-john.jpg',
      size: 11500,
      type: 'image/jpeg'
    },
    {
      url: 'https://i.pravatar.cc/150?img=3',
      name: 'avatar-emily.jpg',
      size: 13000,
      type: 'image/jpeg'
    },
    {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      name: 'brand-story-video.mp4',
      size: 5400000,
      type: 'video/mp4'
    },
    {
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      name: 'product-showcase.mp4',
      size: 4200000,
      type: 'video/mp4'
    }
  ];

  let added = 0;
  let skipped = 0;

  for (const item of mediaItems) {
    try {
      await prisma.media.create({ data: item });
      console.log(`✓ Added: ${item.name}`);
      added++;
    } catch (error) {
      console.log(`⊘ Skipped (already exists): ${item.name}`);
      skipped++;
    }
  }

  console.log(`\nSummary: ${added} added, ${skipped} skipped`);
}

addMedia()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
