import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interviewId = params.id;

    const interview = await prisma.mockInterview.findUnique({
      where: { id: interviewId },
      include: {
        questions: {
          orderBy: { questionNumber: 'desc' },
          take: 1,
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const latestQuestion = interview.questions[0];

    return NextResponse.json({
      success: true,
      question: latestQuestion?.question || '',
      questionNumber: latestQuestion?.questionNumber || 1,
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview' },
      { status: 500 }
    );
  }
}
