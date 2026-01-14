import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
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

    // Get all mock interviews for the user
    const interviews = await prisma.mockInterview.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: 'desc' },
      include: {
        questions: {
          select: {
            id: true,
            questionNumber: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      interviews: interviews.map(interview => ({
        id: interview.id,
        subject: interview.subject,
        difficulty: interview.difficulty,
        role: interview.role,
        status: interview.status,
        startedAt: interview.startedAt,
        completedAt: interview.completedAt,
        duration: interview.duration,
        overallScore: interview.overallScore,
        technicalAccuracy: interview.technicalAccuracy,
        communicationScore: interview.communicationScore,
        depthScore: interview.depthScore,
        confidenceScore: interview.confidenceScore,
        questionCount: interview.questions.length,
      })),
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}
