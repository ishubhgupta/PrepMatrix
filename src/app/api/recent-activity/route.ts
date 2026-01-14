import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get last 10 attempts
    const attempts = await prisma.questionAttempt.findMany({
      where: {
        userId: user.id
      },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            topic: true,
            subject: true
          }
        }
      },
      orderBy: {
        attemptedAt: 'desc'
      },
      take: 10
    });

    const formattedAttempts = attempts.map(attempt => ({
      id: attempt.id,
      questionText: attempt.question.questionText,
      subject: attempt.question.subject,
      topic: attempt.question.topic,
      isCorrect: attempt.isCorrect,
      attemptedAt: attempt.attemptedAt.toISOString(),
      confidence: attempt.confidence
    }));

    return NextResponse.json({
      success: true,
      attempts: formattedAttempts
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
