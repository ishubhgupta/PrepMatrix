import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Extract keywords from user prompt
function extractKeywords(prompt: string): string[] {
  const commonWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'i', 'want', 'to', 'practice', 'some', 'question', 'questions', 'on', 'about', 'related', 'topic', 'interview', 'prepare', 'for', 'and', 'or', 'but']);
  
  const words = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
  
  // Remove duplicates and return
  return [...new Set(words)];
}

// Suggest related existing subjects
function suggestRelatedSubjects(keywords: string[]): string[] {
  const subjectKeywords: Record<string, string[]> = {
    'DBMS': ['database', 'sql', 'mysql', 'postgresql', 'query', 'transaction', 'acid', 'normalization', 'index', 'join', 'rdbms', 'nosql'],
    'Operating Systems': ['os', 'operating', 'system', 'process', 'thread', 'memory', 'cpu', 'scheduling', 'deadlock', 'semaphore', 'mutex', 'kernel'],
    'GenAI': ['ai', 'artificial', 'intelligence', 'llm', 'gpt', 'prompt', 'model', 'training', 'neural', 'machine', 'learning', 'transformer', 'bert', 'chatgpt'],
    'C++ OOP': ['cpp', 'c++', 'oop', 'object', 'oriented', 'class', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'virtual', 'pointer'],
    'Python ML': ['python', 'machine', 'learning', 'ml', 'numpy', 'pandas', 'sklearn', 'tensorflow', 'pytorch', 'data', 'science', 'regression', 'classification'],
  };

  const suggestions: string[] = [];
  const keywordSet = new Set(keywords.map(k => k.toLowerCase()));

  for (const [subject, subjectKeys] of Object.entries(subjectKeywords)) {
    const matchCount = subjectKeys.filter(sk => keywordSet.has(sk)).length;
    if (matchCount > 0) {
      suggestions.push(subject);
    }
  }

  return suggestions;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { prompt, questionCount } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
      return NextResponse.json({ 
        error: 'Please provide a detailed prompt (at least 10 characters)' 
      }, { status: 400 });
    }

    if (![10, 30, 50].includes(questionCount)) {
      return NextResponse.json({ 
        error: 'Question count must be 10, 30, or 50' 
      }, { status: 400 });
    }

    // Extract keywords
    const keywords = extractKeywords(prompt);
    
    // Suggest related subjects
    const suggestions = suggestRelatedSubjects(keywords);

    // Generate a name from prompt (first 50 chars, cleaned up)
    const name = prompt
      .trim()
      .replace(/[^\w\s-]/g, '')
      .substring(0, 50)
      .replace(/\s+/g, ' ')
      .trim() || 'Custom Quiz';

    // Create custom subject record
    const customSubject = await prisma.customSubject.create({
      data: {
        userId: user.id,
        name,
        description: prompt,
        status: 'pending',
        targetCount: questionCount,
        questionCount: 0,
        progress: 0,
        keywords: JSON.stringify(keywords),
      },
    });

    // Start async generation (in background)
    // We'll trigger this via a separate API call or immediate background process
    generateQuestionsInBackground(customSubject.id, prompt, questionCount, keywords);

    return NextResponse.json({
      success: true,
      jobId: customSubject.id,
      name,
      keywords,
      suggestions,
      message: suggestions.length > 0 
        ? `We found related subjects: ${suggestions.join(', ')}. Consider practicing those first!` 
        : 'Quiz generation started!',
    });
  } catch (error) {
    console.error('Error creating custom quiz:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Background generation function (non-blocking)
async function generateQuestionsInBackground(
  subjectId: string, 
  prompt: string, 
  targetCount: number,
  keywords: string[]
) {
  try {
    // Update status to generating
    await prisma.customSubject.update({
      where: { id: subjectId },
      data: { status: 'generating' },
    });

    const { generateQuestions } = await import('@/lib/ai/question-generator');
    
    // Generate questions in batches of 10
    const batchSize = 10;
    const batches = Math.ceil(targetCount / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const batchCount = Math.min(batchSize, targetCount - (i * batchSize));
      
      // Check if cancelled
      const subject = await prisma.customSubject.findUnique({
        where: { id: subjectId },
        select: { status: true },
      });

      if (subject?.status === 'cancelled') {
        break;
      }

      // Generate batch
      const questions = await generateQuestions(prompt, batchCount, keywords);
      
      // Validate and save questions
      const validQuestions = questions.filter((q: any) => 
        q.questionText && 
        q.options && 
        q.options.length === 4 && 
        q.correctAnswer && 
        ['A', 'B', 'C', 'D'].includes(q.correctAnswer)
      );

      // Save to database
      for (const [index, question] of validQuestions.entries()) {
        await prisma.question.create({
          data: {
            id: `custom-${subjectId}-${String(i * batchSize + index + 1).padStart(3, '0')}`,
            subject: subjectId,
            topic: keywords[0] || 'General',
            difficulty: question.difficulty || 'Medium',
            questionText: question.questionText,
            optionsJson: JSON.stringify(question.options),
            correctAnswer: question.correctAnswer,
            rationale: question.rationale || 'No explanation provided.',
            isCustom: true,
            customSubjectId: subjectId,
            createdBy: (await prisma.customSubject.findUnique({ 
              where: { id: subjectId },
              select: { userId: true },
            }))?.userId,
          },
        });
      }

      // Update progress
      const currentCount = (i + 1) * batchSize;
      const progress = Math.min(Math.round((currentCount / targetCount) * 100), 100);
      
      await prisma.customSubject.update({
        where: { id: subjectId },
        data: {
          questionCount: { increment: validQuestions.length },
          progress,
        },
      });
    }

    // Mark as ready
    const finalSubject = await prisma.customSubject.findUnique({
      where: { id: subjectId },
      select: { status: true, questionCount: true },
    });

    if (finalSubject?.status !== 'cancelled') {
      await prisma.customSubject.update({
        where: { id: subjectId },
        data: { 
          status: 'ready',
          progress: 100,
        },
      });
    }

  } catch (error: any) {
    console.error('Error generating questions:', error);
    await prisma.customSubject.update({
      where: { id: subjectId },
      data: { 
        status: 'failed',
        errorMessage: error.message || 'Failed to generate questions',
      },
    });
  }
}
