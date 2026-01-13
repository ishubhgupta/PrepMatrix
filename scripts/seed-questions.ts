import { PrismaClient } from '@prisma/client';
import { allQuestions } from '../src/data';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function seedQuestions() {
  console.log('🌱 Starting question seeding...');
  
  try {
    // Get all question IDs from TypeScript
    const questionIds = allQuestions.map(q => q.id);
    
    // Check which questions already exist
    const existingQuestions = await prisma.question.findMany({
      where: {
        id: {
          in: questionIds
        }
      },
      select: { id: true }
    });
    
    const existingIds = new Set(existingQuestions.map(q => q.id));
    const questionsToCreate = allQuestions.filter(q => !existingIds.has(q.id));
    
    console.log(`📊 Found ${existingIds.size} existing questions`);
    console.log(`📝 Creating ${questionsToCreate.length} new questions`);
    
    if (questionsToCreate.length === 0) {
      console.log('✅ All questions already exist in database!');
      return;
    }
    
    // Transform and create questions
    let created = 0;
    for (const q of questionsToCreate) {
      try {
        // Find the correct answer letter (A, B, C, D)
        const correctIndex = q.options.findIndex(opt => opt.correct);
        const correctAnswer = String.fromCharCode(65 + correctIndex); // 65 is 'A'
        
        await prisma.question.create({
          data: {
            id: q.id,
            subject: q.subject,
            topic: q.topic,
            difficulty: q.difficulty,
            questionText: q.question,
            optionsJson: JSON.stringify(q.options.map(opt => opt.text)),
            correctAnswer,
            rationale: q.rationale
          }
        });
        
        created++;
        if (created % 10 === 0) {
          console.log(`  ⏳ Created ${created}/${questionsToCreate.length} questions...`);
        }
      } catch (error: any) {
        console.error(`❌ Failed to create question ${q.id}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully seeded ${created} questions!`);
    console.log(`📚 Total questions in database: ${existingIds.size + created}`);
    
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedQuestions()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
