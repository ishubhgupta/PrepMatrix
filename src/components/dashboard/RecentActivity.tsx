'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Clock, CheckCircle, XCircle, TrendingUp, Mic, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuizAttempt {
  id: string;
  type: 'quiz';
  questionText: string;
  subject: string;
  topic: string;
  isCorrect: boolean;
  attemptedAt: string;
  confidence?: string;
}

interface InterviewAttempt {
  id: string;
  type: 'interview';
  subject: string;
  difficulty: string;
  role: string;
  overallScore: number;
  attemptedAt: string;
}

type RecentAttempt = QuizAttempt | InterviewAttempt;

export function RecentActivity() {
  const [mounted, setMounted] = useState(false);
  const [attempts, setAttempts] = useState<RecentAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const fetchRecentActivity = async () => {
      try {
        const response = await fetch('/api/recent-activity');
        if (response.ok) {
          const data = await response.json();
          setAttempts(data.attempts || []);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [session]);

  if (!mounted || !session?.user) {
    return null;
  }

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-strong)' }}>
          Recent Activity
        </h2>
        <div className="card p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
            Recent Activity
          </h2>
        </div>
        <div className="card p-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            No activity yet. Start practicing or take a mock interview!
          </p>
        </div>
      </div>
    );
  }

  const quizAttempts = attempts.filter((a): a is QuizAttempt => a.type === 'quiz');
  const correctCount = quizAttempts.filter(a => a.isCorrect).length;
  const accuracy = quizAttempts.length > 0 ? Math.round((correctCount / quizAttempts.length) * 100) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
            Recent Activity
          </h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--accent-soft)' }}>
          <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="font-semibold" style={{ color: 'var(--accent)' }}>
            {accuracy}% accuracy
          </span>
        </div>
      </div>

      <div className="card divide-y divide-black/5">
        {attempts.slice(0, 5).map((attempt) => {
          const timeAgo = getTimeAgo(attempt.attemptedAt);
          
          if (attempt.type === 'interview') {
            return (
              <div 
                key={attempt.id} 
                className="p-4 hover:bg-black/[0.02] transition-colors cursor-pointer"
                onClick={() => router.push(`/mock-interview/results/${attempt.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: 'var(--accent-soft)' }}
                  >
                    <Mic className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-strong)' }}>
                          Mock Interview - {attempt.subject}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {attempt.role.replace(/-/g, ' ')} • {attempt.difficulty}
                        </p>
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {timeAgo}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Award className="w-4 h-4" style={{ color: getScoreColor(attempt.overallScore) }} />
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: getScoreColor(attempt.overallScore) }}
                      >
                        Score: {attempt.overallScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={attempt.id} className="p-4 hover:bg-black/[0.02] transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  attempt.isCorrect 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {attempt.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <p className="font-medium line-clamp-2" style={{ color: 'var(--text-strong)' }}>
                      {attempt.questionText}
                    </p>
                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {timeAgo}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: 'var(--accent-soft)', 
                        color: 'var(--accent)' 
                      }}
                    >
                      {attempt.subject}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {attempt.topic}
                    </span>
                    {attempt.confidence && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Confidence: {attempt.confidence}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {attempts.length > 5 && (
        <div className="mt-4 text-center">
          <a 
            href="/progress" 
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            View all activity →
          </a>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
