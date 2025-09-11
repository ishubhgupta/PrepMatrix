'use client';

import Link from 'next/link';
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
  const progress = getSubjectProgress(subject.id);

  const completionPercentage = progress.totalQuestions > 0 
    ? Math.round((progress.answeredQuestions / progress.totalQuestions) * 100)
    : 0;

  return (
    <Link href={`/quiz/${subject.id}`}>
      <div className="card card-hover p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">
              {subject.name.charAt(0)}
            </span>
          </div>
          <span className="text-xs text-secondary-500 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
            {subject.totalQuestions} questions
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          {subject.name}
        </h3>
        
        <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-4 line-clamp-2">
          {subject.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-secondary-500 mb-2">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          
          {progress.answeredQuestions > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-secondary-600 dark:text-secondary-400">
                {progress.correctAnswers}/{progress.answeredQuestions} correct
              </span>
              <span className="text-success-600 dark:text-success-400 font-medium">
                {Math.round(progress.accuracy * 100)}% accuracy
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
