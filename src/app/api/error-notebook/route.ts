import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch user's error notebook
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

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const resolved = searchParams.get('resolved');

    const where: any = {
      userId: user.id,
    };

    if (subject) {
      where.question = {
        subject: subject
      };
    }

    if (resolved !== null) {
      where.isResolved = resolved === 'true';
    }

    const errors = await prisma.errorNotebook.findMany({
      where,
      include: {
        question: true
      },
      orderBy: {
        lastIncorrectAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, errors });
  } catch (error) {
    console.error('Error fetching error notebook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add or update error notebook entry
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

    const { questionId, isCorrect, notes } = await request.json();

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID required' },
        { status: 400 }
      );
    }

    // If answer is wrong, increment error count
    if (!isCorrect) {
      const existingError = await prisma.errorNotebook.findUnique({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId: questionId
          }
        }
      });

      const updatedError = await prisma.errorNotebook.upsert({
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
          isResolved: false,
          notes: notes || existingError?.notes
        },
        create: {
          userId: user.id,
          questionId: questionId,
          incorrectCount: 1,
          lastIncorrectAt: new Date(),
          isResolved: false,
          notes: notes || ''
        }
      });

      return NextResponse.json({ 
        success: true,
        error: updatedError,
        message: 'Error recorded'
      });
    }

    // If answer is correct and error exists with 2+ mistakes, mark as resolved
    const existingError = await prisma.errorNotebook.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: questionId
        }
      }
    });

    if (existingError && existingError.incorrectCount >= 2 && !existingError.isResolved) {
      const resolvedError = await prisma.errorNotebook.update({
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

      return NextResponse.json({
        success: true,
        error: resolvedError,
        message: 'Error resolved! 🎉'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'No error to update'
    });
  } catch (error) {
    console.error('Error updating error notebook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
