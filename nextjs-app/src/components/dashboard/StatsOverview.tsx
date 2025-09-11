'use client';

import { useQuizStore } from '@/lib/store/quiz-store';
import { subjects } from '@/data';

export function StatsOverview() {
  const { subjectProgress, dailyStats } = useQuizStore();

  // Calculate overall stats
  const totalQuestions = subjects.reduce((sum, subject) => sum + subject.totalQuestions, 0);
  const totalAnswered = Object.values(subjectProgress).reduce((sum, progress) => sum + progress.answeredQuestions, 0);
  const totalCorrect = Object.values(subjectProgress).reduce((sum, progress) => sum + progress.correctAnswers, 0);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Get today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayStats = dailyStats.find(stat => stat.date === today);
  const questionsToday = todayStats?.questionsAnswered || 0;

  // Calculate longest streak
  const longestStreak = Math.max(...Object.values(subjectProgress).map(progress => progress.streak), 0);

  const stats = [
    {
      label: 'Total Questions',
      value: totalQuestions.toLocaleString(),
      description: 'Available across all subjects',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Questions Answered',
      value: totalAnswered.toLocaleString(),
      description: `${totalAnswered > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0}% complete`,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Overall Accuracy',
      value: `${overallAccuracy}%`,
      description: `${totalCorrect}/${totalAnswered} correct`,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Questions Today',
      value: questionsToday.toString(),
      description: 'Keep your streak going!',
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Current Streak',
      value: longestStreak.toString(),
      description: 'Consecutive correct answers',
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="card p-4 text-center">
          <div className={`text-2xl font-bold ${stat.color} mb-1`}>
            {stat.value}
          </div>
          <div className="text-sm font-medium text-secondary-900 dark:text-white mb-1">
            {stat.label}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  );
}
