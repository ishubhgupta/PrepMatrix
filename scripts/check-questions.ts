import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function checkQuestions() {
  try {
    const count = await prisma.question.count();
    console.log(`✅ Total questions in database: ${count}`);
    
    const bySubject = await prisma.question.groupBy({
      by: ['subject'],
      _count: { id: true }
    });
    
    console.log('\n📊 Questions by subject:');
    bySubject.forEach(s => {
      console.log(`  ${s.subject}: ${s._count.id}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuestions();
