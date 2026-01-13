import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow unauthenticated users to use the app
    if (!session?.user?.email) {
      return NextResponse.json({
        success: true,
        message: 'Progress not saved (user not logged in)'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const {
      questionId,
      selectedAnswer,
      isCorrect,
      confidence = 'somewhat',
      timeSpent = 0
    } = await request.json();

    if (!questionId || selectedAnswer === undefined) {
      return NextResponse.json(
        { error: 'Question ID and selected answer required' },
        { status: 400 }
      );
    }

    // Save the attempt
    const attempt = await prisma.questionAttempt.create({
      data: {
        userId: user.id,
        questionId,
        selectedAnswer,
        isCorrect,
        confidence,
        timeSpent,
        attemptedAt: new Date()
      }
    });

    // Update error notebook directly (synchronous)
    try {
      if (!isCorrect) {
        const existingError = await prisma.errorNotebook.findUnique({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: questionId
            }
          }
        });

        await prisma.errorNotebook.upsert({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: questionId
            }
          },
          update: {
            incorrectCount: {
              increment: 1
            },
            lastIncorrectAt: new Date(),
            isResolved: false
          },
          create: {
            userId: user.id,
            questionId: questionId,
            incorrectCount: 1,
            lastIncorrectAt: new Date(),
            isResolved: false
          }
        });
      } else {
        // If correct and error exists with 2+ mistakes, mark resolved
        const existingError = await prisma.errorNotebook.findUnique({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: questionId
            }
          }
        });

        if (existingError && existingError.incorrectCount >= 2 && !existingError.isResolved) {
          await prisma.errorNotebook.update({
            where: {
              userId_questionId: {
                userId: user.id,
                questionId: questionId
              }
            },
            data: {
              isResolved: true,
              resolvedAt: new Date()
            }
          });
        }
      }
    } catch (error) {
      console.error('Error updating error notebook:', error);
    }

    return NextResponse.json({
      success: true,
      attempt
    });
  } catch (error) {
    console.error('Error saving question attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
