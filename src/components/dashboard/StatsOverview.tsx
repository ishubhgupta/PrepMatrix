'use client';

import { useState, useEffect } from 'react';
import { useQuizStore } from '@/lib/store/quiz-store';
import { subjects } from '@/data';

export function StatsOverview() {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const { subjectProgress, dailyStats } = useQuizStore();

  useEffect(() => {
    setMounted(true);
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  // Calculate overall stats
  const totalQuestions = subjects.reduce((sum, subject) => sum + subject.totalQuestions, 0);
  const totalAnswered = Object.values(subjectProgress).reduce((sum, progress) => sum + progress.answeredQuestions, 0);
  const totalCorrect = Object.values(subjectProgress).reduce((sum, progress) => sum + progress.correctAnswers, 0);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Get today's stats
  const todayStats = today ? dailyStats.find(stat => stat.date === today) : null;
  const questionsToday = todayStats?.questionsAnswered || 0;

  // Calculate longest streak
  const longestStreak = Math.max(...Object.values(subjectProgress).map(progress => progress.streak), 0);

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-6 text-center animate-pulse">
            <div className="w-12 h-8 bg-secondary-200 dark:bg-secondary-700 rounded mx-auto mb-2"></div>
            <div className="w-16 h-4 bg-secondary-200 dark:bg-secondary-700 rounded mx-auto mb-1"></div>
            <div className="w-20 h-3 bg-secondary-200 dark:bg-secondary-700 rounded mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Question Library',
      value: totalQuestions.toLocaleString(),
      description: 'Curated interview-grade prompts',
    },
    {
      label: 'Answered So Far',
      value: totalAnswered.toLocaleString(),
      description: `${totalAnswered > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0}% complete`,
    },
    {
      label: 'Accuracy',
      value: `${overallAccuracy}%`,
      description: `${totalCorrect}/${totalAnswered} correct`,
    },
    {
      label: 'Today',
      value: questionsToday.toString(),
      description: 'Questions solved',
    },
    {
      label: 'Streak',
      value: longestStreak.toString(),
      description: 'Consecutive wins',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
      {stats.map((stat, index) => (
        <div key={index} className="card p-4 text-center">
          <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--accent)' }}>
            {stat.value}
          </div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>
            {stat.label}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  );
}
