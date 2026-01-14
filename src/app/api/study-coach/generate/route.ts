import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateStudyPlan } from '@/lib/ai/study-coach';

export const dynamic = 'force-dynamic';

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

    // Get all user attempts to analyze performance
    const attempts = await prisma.questionAttempt.findMany({
      where: { userId: user.id },
      include: {
        question: true,
      },
      orderBy: {
        attemptedAt: 'desc',
      },
    });

    // Get error notebook for recurring mistakes
    const errorNotebook = await prisma.errorNotebook.findMany({
      where: { 
        userId: user.id,
        isResolved: false,
      },
      include: {
        question: true,
      },
      orderBy: {
        incorrectCount: 'desc',
      },
    });

    // Deactivate existing active plans
    await prisma.studyPlan.updateMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Generate AI-powered study plan
    const studyPlan = await generateStudyPlan(user.id, attempts, errorNotebook);

    return NextResponse.json({
      success: true,
      plan: studyPlan,
    });
  } catch (error) {
    console.error('Error generating study plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate study plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
