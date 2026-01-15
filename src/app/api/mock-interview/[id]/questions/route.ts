import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interviewId = params.id;

    // Get all questions for the interview
    const questions = await prisma.mockInterviewQuestion.findMany({
      where: { interviewId },
      orderBy: { questionNumber: 'asc' },
      select: {
        id: true,
        questionNumber: true,
        question: true,
        isFollowUp: true,
      },
    });

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      questions: questions.map((q) => ({
        id: q.id,
        number: q.questionNumber,
        text: q.question,
        isFollowUp: q.isFollowUp,
      })),
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
