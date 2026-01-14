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
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all study plans for user, sorted by creation date (newest first)
    const allPlans = await prisma.studyPlan.findMany({
      where: {
        userId: user.id,
      },
      include: {
        tasks: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get active plan
    const activePlan = allPlans.find(p => p.isActive) || null;

    return NextResponse.json({ 
      activePlan,
      allPlans,
    });
  } catch (error) {
    console.error('Error fetching study plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study plan' },
      { status: 500 }
    );
  }
}

// Update task progress
export async function PATCH(request: NextRequest) {
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
    const { taskId, progress, isCompleted } = body;

    // Update task
    const updatedTask = await prisma.studyPlanTask.update({
      where: { id: taskId },
      data: {
        currentProgress: progress !== undefined ? progress : undefined,
        isCompleted: isCompleted !== undefined ? isCompleted : undefined,
        completedAt: isCompleted ? new Date() : undefined,
      },
    });

    // Update study plan completion count
    if (isCompleted) {
      const task = await prisma.studyPlanTask.findUnique({
        where: { id: taskId },
        include: { studyPlan: true },
      });

      if (task) {
        await prisma.studyPlan.update({
          where: { id: task.studyPlanId },
          data: {
            completedTaskCount: {
              increment: 1,
            },
          },
        });
      }
    }

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
