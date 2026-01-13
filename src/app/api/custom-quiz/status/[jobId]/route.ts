import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
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

    const jobId = params.jobId;

    const customSubject = await prisma.customSubject.findFirst({
      where: {
        id: jobId,
        userId: user.id,
      },
    });

    if (!customSubject) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      status: customSubject.status,
      progress: customSubject.progress,
      questionCount: customSubject.questionCount,
      targetCount: customSubject.targetCount,
      name: customSubject.name,
      errorMessage: customSubject.errorMessage,
    });
  } catch (error) {
    console.error('Error fetching quiz status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Cancel generation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
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

    const jobId = params.jobId;

    const customSubject = await prisma.customSubject.findFirst({
      where: {
        id: jobId,
        userId: user.id,
      },
    });

    if (!customSubject) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Update status to cancelled
    await prisma.customSubject.update({
      where: { id: jobId },
      data: { status: 'cancelled' },
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz generation cancelled',
    });
  } catch (error) {
    console.error('Error cancelling quiz:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
