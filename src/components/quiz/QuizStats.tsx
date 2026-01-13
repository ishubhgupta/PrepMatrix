'use client';

import { useEffect, useState } from 'react';
import { useQuizStore } from '@/lib/store/quiz-store';
import { Target, TrendingUp, CheckCircle } from 'lucide-react';

interface QuizStatsProps {
  totalQuestions: number;
  subject: string;
}

export function QuizStats({ totalQuestions, subject }: QuizStatsProps) {
  const [mounted, setMounted] = useState(false);
  const { questionStates } = useQuizStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate stats from question states
  const subjectQuestions = Object.entries(questionStates).filter(([id]) => 
    id.startsWith(subject.toLowerCase())
  );

  const answeredQuestions = subjectQuestions.filter(([_, state]) => state.answered).length;
  const correctAnswers = subjectQuestions.filter(([_, state]) => 
    state.answered && state.correct
  ).length;
  const accuracy = answeredQuestions > 0 
    ? Math.round((correctAnswers / answeredQuestions) * 100) 
    : 0;
  
  const totalTimeSpent = subjectQuestions.reduce((total, [_, state]) => 
    total + (state.timeSpent || 0), 0
  );
  const avgTimePerQuestion = answeredQuestions > 0
    ? Math.round(totalTimeSpent / answeredQuestions / 1000)
    : 0;

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Total</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">--</p>
            </div>
            <Target className="h-8 w-8 text-primary-600 dark:text-primary-400 opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Answered</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">--</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Accuracy</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">--</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 opacity-50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Total Questions */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Total
            </span>
          </div>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-strong)' }}>{totalQuestions}</p>
        </div>

        {/* Answered */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" style={{ color: '#3b82f6' }} />
            <span className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Answered
            </span>
          </div>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-strong)' }}>{answeredQuestions}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0}% complete
          </p>
        </div>

        {/* Accuracy */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} />
            <span className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Accuracy
            </span>
          </div>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-strong)' }}>{accuracy}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {correctAnswers}/{answeredQuestions} correct
          </p>
        </div>
      </div>
    </div>
  );
}
