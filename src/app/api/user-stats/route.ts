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

    // Get all attempts for this user
    const attempts = await prisma.questionAttempt.findMany({
      where: { userId: user.id },
      include: {
        question: true,
      },
    });

    // Calculate overall stats
    const totalAnswered = attempts.length;
    const totalCorrect = attempts.filter(a => a.isCorrect).length;
    const overallAccuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

    // Calculate subject-wise stats
    const subjectStats: Record<string, {
      answered: number;
      correct: number;
      accuracy: number;
      total: number;
    }> = {};

    // Get total questions per subject
    const questionsBySubject = await prisma.question.groupBy({
      by: ['subject'],
      _count: {
        id: true,
      },
    });

    const totalsBySubject: Record<string, number> = {};
    questionsBySubject.forEach(group => {
      totalsBySubject[group.subject] = group._count.id;
    });

    attempts.forEach(attempt => {
      const subject = attempt.question.subject;
      if (!subjectStats[subject]) {
        subjectStats[subject] = {
          answered: 0,
          correct: 0,
          accuracy: 0,
          total: totalsBySubject[subject] || 0,
        };
      }
      subjectStats[subject].answered++;
      if (attempt.isCorrect) {
        subjectStats[subject].correct++;
      }
    });

    // Calculate accuracy for each subject
    Object.keys(subjectStats).forEach(subject => {
      const stats = subjectStats[subject];
      stats.accuracy = stats.answered > 0 ? (stats.correct / stats.answered) * 100 : 0;
    });

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAttempts = attempts.filter(a => {
      const attemptDate = new Date(a.attemptedAt);
      attemptDate.setHours(0, 0, 0, 0);
      return attemptDate.getTime() === today.getTime();
    });

    const questionsToday = todayAttempts.length;

    // Get mock interviews for calendar
    const mockInterviews = await prisma.mockInterview.findMany({
      where: {
        userId: user.id,
        status: 'completed'
      },
    });

    // Get last 7 days activity (including mock interviews)
    const dailyStats: Array<{
      date: string;
      questionsAnswered: number;
      correctAnswers: number;
      accuracy: number;
      mockInterviews: number;
    }> = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayAttempts = attempts.filter(a => {
        const attemptDate = new Date(a.attemptedAt);
        attemptDate.setHours(0, 0, 0, 0);
        return attemptDate.getTime() === date.getTime();
      });

      const dayInterviews = mockInterviews.filter(interview => {
        const completedDate = interview.completedAt ? new Date(interview.completedAt) : null;
        if (!completedDate) return false;
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === date.getTime();
      });

      const questionsAnswered = dayAttempts.length;
      const correctAnswers = dayAttempts.filter(a => a.isCorrect).length;
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        questionsAnswered,
        correctAnswers,
        accuracy: questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0,
        mockInterviews: dayInterviews.length,
      });
    }

    // Calculate streak (consecutive days with at least 1 question)
    let currentStreak = 0;
    let longestStreak = 0;
    const sortedDates = [...new Set(attempts.map(a => {
      const date = new Date(a.attemptedAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }))].sort((a, b) => b - a);

    if (sortedDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      
      // Check if today or yesterday has activity
      if (sortedDates[0] === todayTime || sortedDates[0] === todayTime - 86400000) {
        currentStreak = 1;
        let expectedDate = sortedDates[0] - 86400000;
        
        for (let i = 1; i < sortedDates.length; i++) {
          if (sortedDates[i] === expectedDate) {
            currentStreak++;
            expectedDate -= 86400000;
          } else {
            break;
          }
        }
      }
      
      longestStreak = currentStreak;
      
      // Calculate longest streak from all dates
      let tempStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        if (sortedDates[i - 1] - sortedDates[i] === 86400000) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalAnswered,
        totalCorrect,
        overallAccuracy: Math.round(overallAccuracy),
        questionsToday,
        currentStreak,
        longestStreak,
        subjectStats,
        dailyStats,
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
