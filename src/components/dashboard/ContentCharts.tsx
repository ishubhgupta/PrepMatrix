'use client';

import { useState, useEffect } from 'react';
import { useQuizStore } from '@/lib/store/quiz-store';
import { subjects } from '@/data';

export function ContentCharts() {
  const [mounted, setMounted] = useState(false);
  const { subjectProgress, dailyStats } = useQuizStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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

  // Get real subject data
  const subjectData = subjects.map(subject => {
    const progress = subjectProgress[subject.id];
    const accuracy = progress?.accuracy ? Math.round(progress.accuracy * 100) : 0;
    return {
      subject: subject.name,
      score: accuracy,
      answered: progress?.answeredQuestions || 0,
      total: subject.totalQuestions,
      color: subject.color,
    };
  }).filter(s => s.answered > 0); // Only show subjects with progress

  // Get recent activity from daily stats
  const recentActivity = dailyStats
    .slice(-7)
    .reverse()
    .map(stat => ({
      date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      questionsAnswered: stat.questionsAnswered,
      accuracy: stat.questionsAnswered > 0 ? Math.round((stat.correctAnswers / stat.questionsAnswered) * 100) : 0,
    }));

  const hasData = subjectData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subject Breakdown */}
      <div className="card p-6 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50 shadow-lg">
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">
          Subject Breakdown
        </h3>
        {hasData ? (
          <div className="space-y-4">
            {subjectData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-secondary-700 dark:text-secondary-300">
                    {item.subject}
                  </span>
                  <span className="text-sm font-bold text-secondary-900 dark:text-white">
                    {item.score}% ({item.answered}/{item.total})
                  </span>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-600`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-200/50 dark:border-primary-800/50">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-secondary-600 dark:text-secondary-300">
                Start answering questions to see your progress
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card p-6 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50 shadow-lg">
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">
          Recent Activity (Last 7 Days)
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-800 dark:to-primary-900/20 border border-secondary-200/30 dark:border-secondary-700/30">
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {activity.date}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {activity.questionsAnswered} questions answered
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">
                    {activity.accuracy}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-200/50 dark:border-primary-800/50">
            <div className="text-center">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-secondary-600 dark:text-secondary-300">
                Your activity history will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
