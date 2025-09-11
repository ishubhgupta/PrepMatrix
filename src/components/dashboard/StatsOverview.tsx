'use client';

import { useEffect, useState } from 'react';
import { useQuizStore } from '@/lib/store/quiz-store';
import { SkeletonStats } from '@/components/ui/LoadingSpinner';
import { subjects } from '@/data';

export function StatsOverview() {
  const { subjectProgress, dailyStats } = useQuizStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <SkeletonStats />;
  }

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
      bgColor: 'from-blue-500 to-cyan-500',
      icon: '📚',
    },
    {
      label: 'Questions Answered',
      value: totalAnswered.toLocaleString(),
      description: `${totalAnswered > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0}% complete`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'from-green-500 to-emerald-500',
      icon: '✓',
    },
    {
      label: 'Overall Accuracy',
      value: `${overallAccuracy}%`,
      description: `${totalCorrect}/${totalAnswered} correct`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'from-purple-500 to-indigo-500',
      icon: '🎯',
    },
    {
      label: 'Questions Today',
      value: questionsToday.toString(),
      description: 'Keep your streak going!',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'from-orange-500 to-red-500',
      icon: '📅',
    },
    {
      label: 'Current Streak',
      value: longestStreak.toString(),
      description: 'Consecutive correct answers',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'from-red-500 to-pink-500',
      icon: '🔥',
    },
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent mb-2">
          Your Learning Progress
        </h2>
        <p className="text-secondary-600 dark:text-secondary-300">
          Track your journey across all subjects
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group relative card card-hover p-6 text-center overflow-hidden transform transition-all duration-500 hover:scale-105"
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            {/* Floating icon */}
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110 flex items-center justify-center">
              <span className="text-lg">{stat.icon}</span>
            </div>
            
            <div className="relative z-10">
              {/* Main value */}
              <div className={`text-3xl md:text-4xl font-black ${stat.color} mb-2 transform transition-all duration-300 group-hover:scale-110`}>
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-sm font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {stat.label}
              </div>
              
              {/* Description */}
              <div className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
                {stat.description}
              </div>
              
              {/* Progress indicator for completed questions */}
              {stat.label === 'Questions Answered' && totalAnswered > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.round((totalAnswered / totalQuestions) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Accuracy indicator */}
              {stat.label === 'Overall Accuracy' && totalAnswered > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${overallAccuracy}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
