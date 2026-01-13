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
    const type = searchParams.get('type'); // 'overconfident' | 'underconfident' | 'all'
    const subject = searchParams.get('subject');

    // Get all attempts with questions
    const attempts = await prisma.questionAttempt.findMany({
      where: {
        userId: user.id,
        ...(subject && subject !== 'all' ? {
          question: {
            subject: subject
          }
        } : {})
      },
      include: {
        question: true
      },
      orderBy: {
        attemptedAt: 'desc'
      }
    });

    // Analyze confidence mismatches
    const overconfidentAttempts = attempts.filter(
      (a: any) => a.confidence === 'very' && !a.isCorrect
    );

    const underconfidentAttempts = attempts.filter(
      (a: any) => a.confidence === 'guessing' && a.isCorrect
    );

    const somewhatWrong = attempts.filter(
      (a: any) => a.confidence === 'somewhat' && !a.isCorrect
    );

    // Calculate patterns by topic
    const topicAnalysis: Record<string, {
      overconfident: number;
      underconfident: number;
      totalAttempts: number;
      accuracy: number;
    }> = {};

    attempts.forEach((attempt: any) => {
      const topic = attempt.question.topic;
      if (!topicAnalysis[topic]) {
        topicAnalysis[topic] = {
          overconfident: 0,
          underconfident: 0,
          totalAttempts: 0,
          accuracy: 0
        };
      }

      topicAnalysis[topic].totalAttempts++;
      if (attempt.isCorrect) {
        topicAnalysis[topic].accuracy++;
      }
      if (attempt.confidence === 'very' && !attempt.isCorrect) {
        topicAnalysis[topic].overconfident++;
      }
      if (attempt.confidence === 'guessing' && attempt.isCorrect) {
        topicAnalysis[topic].underconfident++;
      }
    });

    // Calculate accuracy percentages
    Object.keys(topicAnalysis).forEach(topic => {
      const data = topicAnalysis[topic];
      data.accuracy = data.totalAttempts > 0 
        ? (data.accuracy / data.totalAttempts) * 100 
        : 0;
    });

    // Overall stats
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a: any) => a.isCorrect).length;
    const overconfidenceRate = totalAttempts > 0 
      ? (overconfidentAttempts.length / totalAttempts) * 100 
      : 0;
    const underconfidenceRate = totalAttempts > 0 
      ? (underconfidentAttempts.length / totalAttempts) * 100 
      : 0;

    // Filter based on type
    let filteredAttempts = attempts;
    if (type === 'overconfident') {
      filteredAttempts = overconfidentAttempts;
    } else if (type === 'underconfident') {
      filteredAttempts = underconfidentAttempts;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalAttempts,
        correctAttempts,
        accuracy: totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0,
        overconfidentCount: overconfidentAttempts.length,
        underconfidentCount: underconfidentAttempts.length,
        somewhatWrongCount: somewhatWrong.length,
        overconfidenceRate,
        underconfidenceRate
      },
      attempts: filteredAttempts,
      topicAnalysis: Object.entries(topicAnalysis)
        .map(([topic, data]) => ({ topic, ...data }))
        .sort((a, b) => b.overconfident - a.overconfident)
    });
  } catch (error) {
    console.error('Error fetching confidence analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
