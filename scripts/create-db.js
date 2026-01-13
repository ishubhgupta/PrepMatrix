const { PrismaClient } = require('@prisma/client');

async function createDatabase() {
  const prisma = new PrismaClient({
    datasourceUrl: 'mysql://4GMsiZeAisLHq9S.root:mi4873LxA8umXePb@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000',
  });

  try {
    await prisma.$executeRawUnsafe('CREATE DATABASE IF NOT EXISTS prepmatrix');
    console.log('✅ Database "prepmatrix" created successfully!');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDatabase();
