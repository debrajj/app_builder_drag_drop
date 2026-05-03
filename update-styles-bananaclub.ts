import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎨 Updating Global Styles for Banana Club...');

  const styleList = JSON.stringify([
    { name: "Primary", color: "#E5472A" },
    { name: "Secondary", color: "#000000" },
    { name: "Background", color: "#FFFFFF" },
    { name: "Text", color: "#1A1A1A" }
  ]);

  const existing = await prisma.globalStyle.findFirst();
  if (existing) {
    await prisma.globalStyle.update({
      where: { id: existing.id },
      data: { styleList }
    });
  } else {
    await prisma.globalStyle.create({
      data: { styleList }
    });
  }

  console.log('✅ Global styles updated!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
