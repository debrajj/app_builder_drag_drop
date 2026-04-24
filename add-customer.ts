import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('👤 Add New Customer\n');

  const email = await question('Email: ');
  const password = await question('Password: ');
  const name = await question('Name: ');
  const roleInput = await question('Role (customer/admin) [customer]: ');
  const role = roleInput.trim() || 'customer';

  console.log('\n🔄 Creating customer...');

  // Check if user already exists
  const existingUser = await prisma.customer.findUnique({ where: { email } });
  if (existingUser) {
    console.log('❌ Error: Email already exists');
    rl.close();
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const customer = await prisma.customer.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    }
  });

  console.log('\n✅ Customer created successfully!');
  console.log('\n📝 Details:');
  console.log(`   ID: ${customer.id}`);
  console.log(`   Email: ${customer.email}`);
  console.log(`   Name: ${customer.name}`);
  console.log(`   Role: ${customer.role}`);
  console.log(`   Created: ${customer.createdAt}`);

  rl.close();
}

main()
  .catch((e) => {
    console.error('\n❌ Error:', e.message);
    rl.close();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
