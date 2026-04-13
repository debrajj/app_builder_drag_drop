import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // @ts-ignore
  datasourceUrl: "file:./dev.db"
});

export default prisma;
