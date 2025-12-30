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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {/* Total Questions */}
      <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">{totalQuestions}</p>
          </div>
          <Target className="h-8 w-8 text-primary-600 dark:text-primary-400 opacity-80" />
        </div>
      </div>

      {/* Answered */}
      <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Answered</p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">{answeredQuestions}</p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              {totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0}% complete
            </p>
          </div>
          <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-80" />
        </div>
      </div>

      {/* Accuracy */}
      <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">{accuracy}%</p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              {correctAnswers}/{answeredQuestions} correct
            </p>
          </div>
          <TrendingUp className={`h-8 w-8 opacity-80 ${
            accuracy >= 80 ? 'text-green-600 dark:text-green-400' :
            accuracy >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
            'text-red-600 dark:text-red-400'
          }`} />
        </div>
      </div>
    </div>
  );
}
