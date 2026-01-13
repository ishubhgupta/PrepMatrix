import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// SM-2 Algorithm implementation
function calculateNextReview(
  quality: number, // 0-5 scale
  easeFactor: number,
  interval: number,
  repetitions: number
) {
  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions = repetitions + 1;
  } else {
    // Incorrect response - reset
    newRepetitions = 0;
    newInterval = 1;
  }

  // Update ease factor
  newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate
  };
}

// Map confidence and correctness to quality score (0-5)
function getQualityScore(isCorrect: boolean, confidence: string): number {
  if (isCorrect) {
    if (confidence === 'very') return 5;
    if (confidence === 'somewhat') return 4;
    return 3; // guessing but correct
  } else {
    if (confidence === 'very') return 2;
    if (confidence === 'somewhat') return 1;
    return 0; // guessing and wrong
  }
}

export async function POST(request: NextRequest) {
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

    const { questionId, isCorrect, confidence = 'somewhat' } = await request.json();

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID required' },
        { status: 400 }
      );
    }

    // Get existing spaced repetition record or create new one
    const existing = await prisma.spacedRepetition.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: questionId
        }
      }
    });

    const quality = getQualityScore(isCorrect, confidence);
    
    const currentEaseFactor = existing?.easeFactor || 2.5;
    const currentInterval = existing?.interval || 0;
    const currentRepetitions = existing?.repetitions || 0;

    const {
      easeFactor,
      interval,
      repetitions,
      nextReviewDate
    } = calculateNextReview(quality, currentEaseFactor, currentInterval, currentRepetitions);

    // Update consecutive counters
    const consecutiveCorrect = isCorrect ? (existing?.consecutiveCorrect || 0) + 1 : 0;
    const consecutiveWrong = !isCorrect ? (existing?.consecutiveWrong || 0) + 1 : 0;

    const updated = await prisma.spacedRepetition.upsert({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: questionId
        }
      },
      update: {
        easeFactor,
        interval,
        repetitions,
        nextReviewDate,
        consecutiveCorrect,
        consecutiveWrong,
        lastReviewedAt: new Date()
      },
      create: {
        userId: user.id,
        questionId: questionId,
        easeFactor,
        interval,
        repetitions,
        nextReviewDate,
        consecutiveCorrect,
        consecutiveWrong,
        lastReviewedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      spacedRepetition: updated
    });
  } catch (error) {
    console.error('Error updating spaced repetition:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
