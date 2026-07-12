import { PrismaClient } from '@prisma/client';

const passwords = ['', 'root', 'admin', 'mysql', '123456', 'password', 'password123'];

async function testAll() {
  for (const pw of passwords) {
    const url = `mysql://root:${pw}@localhost:3306/transitops`;
    console.log(`Testing: mysql://root:${pw ? '***' : '(empty)'}@localhost:3306/transitops`);
    process.env.DATABASE_URL = url;
    
    // We instantiate a new PrismaClient with the override url
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url,
        },
      },
    });
    
    try {
      await prisma.$connect();
      console.log(`✅ SUCCESS! Password is: "${pw}"`);
      await prisma.$disconnect();
      return;
    } catch (err: any) {
      console.log(`❌ Failed: ${err.message?.split('\n')[0]}`);
      await prisma.$disconnect();
    }
  }
  console.log('❌ Could not connect with any of the guessed passwords.');
}

testAll();
