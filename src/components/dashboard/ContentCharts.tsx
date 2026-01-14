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

  // Get recent activity from API stats - convert to calendar format
  const activityMap = new Map<string, { questionsAnswered: number; accuracy: number }>();
  (stats?.dailyStats || []).forEach(stat => {
    const dateKey = new Date(stat.date).toISOString().split('T')[0];
    activityMap.set(dateKey, {
      questionsAnswered: stat.questionsAnswered,
      accuracy: Math.round(stat.accuracy),
    });
  });

  // Generate calendar for current month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  // Create calendar grid
  const calendarDays: Array<{ date: number | null; dateString: string | null; isToday: boolean }> = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push({ date: null, dateString: null, isToday: false });
  }
  
  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    // Create date string in local timezone to avoid UTC offset issues
    const year = currentYear.toString();
    const month = (currentMonth + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;
    const isToday = day === currentDate.getDate() && 
                    currentMonth === currentDate.getMonth() && 
                    currentYear === currentDate.getFullYear();
    calendarDays.push({ date: day, dateString, isToday });
  }

  const monthName = firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

      {/* Recent Activity - Calendar View */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-strong)' }}>
          {monthName}
        </h3>
        
        {/* Calendar Grid */}
        <div>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold py-2" style={{ color: 'var(--text-muted)' }}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayInfo, index) => {
              const activity = dayInfo.dateString ? activityMap.get(dayInfo.dateString) : null;
              const hasActivity = !!activity && activity.questionsAnswered > 0;
              
              return (
                <div
                  key={index}
                  className="relative aspect-square flex items-center justify-center rounded-lg transition-all duration-200 group"
                  style={{
                    background: hasActivity ? 'var(--accent)' : 'transparent',
                    border: dayInfo.isToday ? '2px solid var(--accent)' : 'none',
                    cursor: hasActivity ? 'pointer' : 'default',
                  }}
                >
                  {dayInfo.date && (
                    <>
                      <span 
                        className="text-sm font-medium"
                        style={{ 
                          color: hasActivity ? 'white' : 'var(--text-strong)',
                        }}
                      >
                        {dayInfo.date}
                      </span>
                      
                      {/* Tooltip on hover */}
                      {hasActivity && activity && (
                        <div 
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap"
                          style={{ 
                            background: 'var(--bg-bone)',
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        >
                          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-strong)' }}>
                            {new Date(dayInfo.dateString!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {activity.questionsAnswered} questions
                          </div>
                          <div className="text-xs font-medium" style={{ color: '#2f9e44' }}>
                            {activity.accuracy}% accuracy
                          </div>
                          {/* Tooltip arrow */}
                          <div 
                            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                            style={{
                              borderLeft: '6px solid transparent',
                              borderRight: '6px solid transparent',
                              borderTop: '6px solid var(--bg-bone)',
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'var(--accent)' }}></div>
              <span style={{ color: 'var(--text-muted)' }}>Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2" style={{ borderColor: 'var(--accent)' }}></div>
              <span style={{ color: 'var(--text-muted)' }}>Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
