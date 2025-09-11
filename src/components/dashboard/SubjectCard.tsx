'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuizStore } from '@/lib/store/quiz-store';

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    description: string;
    color: string;
    totalQuestions: number;
  };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const { getSubjectProgress } = useQuizStore();
  const [progress, setProgress] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    accuracy: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getSubjectProgress(subject.id));
  }, [subject.id, getSubjectProgress]);

  const completionPercentage = mounted && progress.totalQuestions > 0 
    ? Math.round((progress.answeredQuestions / progress.totalQuestions) * 100)
    : 0;

  const getSubjectGradient = (subjectId: string) => {
    const gradients = {
      DBMS: 'from-blue-500 to-cyan-500',
      PythonML: 'from-green-500 to-emerald-500',
      CppOOP: 'from-purple-500 to-indigo-500',
      GenAI: 'from-orange-500 to-red-500'
    };
    return gradients[subjectId as keyof typeof gradients] || 'from-primary-500 to-purple-500';
  };

  const getSubjectIcon = (subjectId: string) => {
    const icons = {
      DBMS: '🗄️',
      PythonML: '🐍',
      CppOOP: '⚡',
      GenAI: '🤖'
    };
    return icons[subjectId as keyof typeof icons] || '📚';
  };

  return (
    <Link href={`/quiz/${subject.id}`}>
      <div className="group relative card card-hover p-6 h-full overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getSubjectGradient(subject.id)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        {/* Floating orbs */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary-200 to-purple-200 dark:from-primary-800 dark:to-purple-800 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"></div>
        <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-110"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className={`relative w-14 h-14 bg-gradient-to-br ${getSubjectGradient(subject.id)} rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-xl`}>
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-2xl transform transition-transform duration-300 group-hover:scale-110">
                {getSubjectIcon(subject.id)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-secondary-500 bg-secondary-100 dark:bg-secondary-700 px-3 py-1.5 rounded-full font-medium">
                {subject.totalQuestions} questions
              </span>
              {mounted && progress.answeredQuestions > 0 && (
                <div className="mt-2 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-success-600 dark:text-success-400 font-medium">
                    {Math.round(progress.accuracy * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            {subject.name}
          </h3>
          
          <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-6 line-clamp-2 leading-relaxed">
            {subject.description}
          </p>
          
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between text-xs text-secondary-500 mb-2">
              <span className="font-medium">Progress</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">{completionPercentage}%</span>
            </div>
            
            {/* Enhanced progress bar */}
            <div className="relative w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600 rounded-full"></div>
              <div 
                className={`relative h-full bg-gradient-to-r ${getSubjectGradient(subject.id)} rounded-full transition-all duration-1000 shadow-sm`}
                style={{ width: `${completionPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
              </div>
              {completionPercentage > 0 && (
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm animate-bounce"></div>
              )}
            </div>
            
            {mounted && progress.answeredQuestions > 0 && (
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-secondary-600 dark:text-secondary-400 font-medium">
                  <span className="text-success-600 dark:text-success-400">{progress.correctAnswers}</span>
                  <span className="mx-1">/</span>
                  <span>{progress.answeredQuestions}</span>
                  <span className="ml-1">correct</span>
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping"></div>
                  <span className="text-primary-600 dark:text-primary-400 font-bold">
                    Start Quiz →
                  </span>
                </div>
              </div>
            )}
            
            {mounted && progress.answeredQuestions === 0 && (
              <div className="flex items-center justify-center text-xs pt-2">
                <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-medium">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping"></div>
                  <span>Begin your journey →</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
