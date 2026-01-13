'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { subjects } from '@/data';

interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  questionsToday: number;
  currentStreak: number;
  longestStreak: number;
  subjectStats: Record<string, {
    answered: number;
    correct: number;
    accuracy: number;
    total: number;
  }>;
  dailyStats: Array<{
    date: string;
    questionsAnswered: number;
    correctAnswers: number;
    accuracy: number;
  }>;
}

export function StatsOverview() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session]);

  // Calculate overall stats
  const totalQuestions = subjects.reduce((sum, subject) => sum + subject.totalQuestions, 0);
  const totalAnswered = stats?.totalAnswered || 0;
  const totalCorrect = stats?.totalCorrect || 0;
  const overallAccuracy = stats?.overallAccuracy || 0;
  const questionsToday = stats?.questionsToday || 0;
  const longestStreak = stats?.longestStreak || 0;

  if (!mounted || loading) {
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

  const statsData = [
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
      {statsData.map((stat, index) => (
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
