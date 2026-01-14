import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Deactivate all plans
    await prisma.studyPlan.updateMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Activate the selected plan
    const updatedPlan = await prisma.studyPlan.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        isActive: true,
      },
      include: {
        tasks: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (error) {
    console.error('Error activating plan:', error);
    return NextResponse.json(
      { error: 'Failed to activate plan' },
      { status: 500 }
    );
  }
}
