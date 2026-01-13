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

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');

    const where: any = {
      userId: user.id,
      nextReviewDate: {
        lte: new Date()
      }
    };

    if (subject) {
      where.question = {
        subject: subject
      };
    }

    const dueReviews = await prisma.spacedRepetition.findMany({
      where,
      include: {
        question: true
      },
      orderBy: {
        nextReviewDate: 'asc'
      }
    });

    return NextResponse.json({
      count: dueReviews.length,
      reviews: dueReviews
    });
  } catch (error) {
    console.error('Error fetching review queue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
