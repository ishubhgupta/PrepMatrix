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

export function ContentCharts() {
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

  if (!mounted || loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 animate-pulse">
          <div className="h-64 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
        </div>
        <div className="card p-6 animate-pulse">
          <div className="h-64 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Get real subject data from API stats
  const subjectData = subjects.map(subject => {
    const progress = stats?.subjectStats?.[subject.id];
    const accuracy = progress?.accuracy ? Math.round(progress.accuracy) : 0;
    return {
      subject: subject.name,
      score: accuracy,
      answered: progress?.answered || 0,
      total: progress?.total || subject.totalQuestions,
      color: subject.color,
    };
  }).filter(s => s.answered > 0); // Only show subjects with progress

  // Get recent activity from API stats
  const recentActivity = (stats?.dailyStats || [])
    .slice(-7)
    .reverse()
    .map(stat => ({
      date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      questionsAnswered: stat.questionsAnswered,
      accuracy: Math.round(stat.accuracy),
    }));

  const hasData = subjectData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subject Breakdown */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-strong)' }}>
          Subject Breakdown
        </h3>
        {hasData ? (
          <div className="space-y-5">
            {subjectData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: 'var(--text-strong)' }}>
                    {item.subject}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {item.score}% · {item.answered}/{item.total}
                  </span>
                </div>
                <div className="w-full rounded-full h-2.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
                  <div 
                    className="h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${item.score}%`, background: 'var(--accent)' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
            <div className="text-center">
              <div className="text-5xl mb-3 opacity-30">📊</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Start answering to see progress
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-strong)' }}>
          Recent Activity
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-strong)' }}>
                    {activity.date}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {activity.questionsAnswered} questions
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold" style={{ color: '#2f9e44' }}>
                    {activity.accuracy}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
            <div className="text-center">
              <div className="text-5xl mb-3 opacity-30">📅</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Activity history will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
