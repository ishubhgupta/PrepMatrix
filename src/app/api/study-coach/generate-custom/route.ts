import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateCustomStudyPlan } from '@/lib/ai/study-coach';

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

    const body = await request.json();
    const { topic, timeframe, depth, specificGoals } = body;

    if (!topic || !timeframe || !depth) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, timeframe, depth' },
        { status: 400 }
      );
    }

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

    // Generate custom study plan
    const studyPlan = await generateCustomStudyPlan(
      user.id,
      topic,
      timeframe,
      depth,
      specificGoals || []
    );

    return NextResponse.json({
      success: true,
      plan: studyPlan,
    });
  } catch (error) {
    console.error('Error generating custom study plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate custom study plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
