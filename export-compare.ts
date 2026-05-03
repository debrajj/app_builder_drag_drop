import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const showcase = await prisma.page.findFirst({
    where: { slug: 'showcase' },
    include: {
      collectionGroups: {
        include: { collections: { include: { items: true } } },
        orderBy: { order: 'asc' }
      }
    }
  });

  const banaclub = await prisma.page.findFirst({
    where: { slug: 'banaclub' },
    include: {
      collectionGroups: {
        include: { collections: { include: { items: true } } },
        orderBy: { order: 'asc' }
      }
    }
  });

  fs.writeFileSync('compare-data.json', JSON.stringify({ showcase, banaclub }, null, 2));
  console.log('✅ Exported comparison data to compare-data.json');
}

main().finally(() => prisma.$disconnect());
