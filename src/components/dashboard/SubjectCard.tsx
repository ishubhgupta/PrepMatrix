'use client';

import { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const { getSubjectProgress } = useQuizStore();
  const progress = getSubjectProgress(subject.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const completionPercentage = progress.totalQuestions > 0 
    ? Math.round((progress.answeredQuestions / progress.totalQuestions) * 100)
    : 0;

  return (
    <Link href={`/quiz/${subject.id}/`}>
      <div className="card card-hover p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <span className="font-bold text-lg">
              {subject.name.charAt(0)}
            </span>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)' }}>
            {subject.totalQuestions}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
          {subject.name}
        </h3>
        
        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
          {subject.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>Progress</span>
            <span className="font-medium">{mounted ? completionPercentage : 0}%</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: mounted ? `${completionPercentage}%` : '0%', background: 'var(--accent)' }}
            />
          </div>
          
          {mounted && progress.answeredQuestions > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>
                {progress.correctAnswers}/{progress.answeredQuestions} correct
              </span>
              <span className="font-medium" style={{ color: '#2f9e44' }}>
                {Math.round(progress.accuracy * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
