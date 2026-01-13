'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AlertTriangle, CheckCircle, TrendingUp, BookOpen, Target } from 'lucide-react';

interface ErrorQuestion {
  id: string;
  questionId: string;
  incorrectCount: number;
  lastIncorrectAt: string;
  isResolved: boolean;
  question: {
    id: string;
    subject: string;
    topic: string;
    difficulty: string;
    questionText: string;
  };
}

export default function ErrorNotebookPage() {
  const { data: session } = useSession();
  const [errors, setErrors] = useState<ErrorQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'resolved'>('active');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const fetchErrors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        resolved: filter === 'resolved' ? 'true' : 'false',
        ...(selectedSubject !== 'all' && { subject: selectedSubject }),
      });
      
      const response = await fetch(`/api/error-notebook?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setErrors(data.errors);
      }
    } catch (error) {
      console.error('Failed to fetch errors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, filter, selectedSubject]);

  const subjects = ['all', 'GenAI', 'CppOOP', 'DBMS', 'OS', 'PythonML'];

  const getPatternAnalysis = () => {
    const patterns: { [key: string]: number } = {};
    errors.forEach(error => {
      const key = error.question.topic;
      patterns[key] = (patterns[key] || 0) + error.incorrectCount;
    });
    return Object.entries(patterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-bone)' }}>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="card p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
              Sign In Required
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Error tracking is only available for authenticated users.
            </p>
            <a href="/auth/signin" className="btn btn-primary mt-6 inline-block">
              Sign In
            </a>
          </div>
        </main>
      </div>
    );
  }

  const patterns = getPatternAnalysis();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-bone)' }}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
            Error Notebook
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Track and fix questions you've struggled with
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
                  {errors.filter(e => !e.isResolved).length}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Active Errors
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
                  {errors.filter(e => e.isResolved).length}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Resolved
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-soft)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
                  {errors.length > 0 ? Math.round((errors.filter(e => e.isResolved).length / errors.length) * 100) : 0}%
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mistake Patterns */}
        {patterns.length > 0 && (
          <div className="card p-6 mb-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
              <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              Your Mistake Patterns
            </h3>
            <div className="space-y-3">
              {patterns.map(([topic, count]) => (
                <div key={topic}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--text-strong)' }}>{topic}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} mistakes</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(count / Math.max(...patterns.map(p => p[1]))) * 100}%`,
                        backgroundColor: 'var(--accent)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--text-muted)' }}>
              💡 You struggle with <strong>{patterns[0]?.[0]}</strong>. Focus on this topic for maximum improvement.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-[color:var(--accent)] text-white'
                  : 'bg-white text-[color:var(--text-muted)] hover:bg-[color:var(--accent-soft)]'
              }`}
            >
              Active ({errors.filter(e => !e.isResolved).length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'resolved'
                  ? 'bg-[color:var(--accent)] text-white'
                  : 'bg-white text-[color:var(--text-muted)] hover:bg-[color:var(--accent-soft)]'
              }`}
            >
              Resolved ({errors.filter(e => e.isResolved).length})
            </button>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject === 'all' ? 'All Subjects' : subject}
              </option>
            ))}
          </select>
        </div>

        {/* Fix My Mistakes Button */}
        {errors.filter(e => !e.isResolved).length > 0 && (
          <a
            href={`/quiz/${selectedSubject !== 'all' ? selectedSubject : errors[0]?.question.subject}?mode=errors`}
            className="btn btn-primary mb-6 inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Fix My Mistakes ({errors.filter(e => !e.isResolved).length} questions)
          </a>
        )}

        {/* Error List */}
        {loading ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            Loading errors...
          </div>
        ) : errors.length === 0 ? (
          <div className="card p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
              {filter === 'active' ? 'No Active Errors!' : 'No Resolved Errors Yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {filter === 'active' 
                ? 'Keep up the great work! Answer questions to start tracking errors.'
                : 'Resolve some errors to see them here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {errors.map((error) => (
              <div key={error.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      error.question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      error.question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {error.question.difficulty}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {error.question.subject} • {error.question.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      {error.incorrectCount} mistakes
                    </span>
                    {error.isResolved && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ✓ Resolved
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-base mb-3" style={{ color: 'var(--text-strong)' }}>
                  {error.question.questionText}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>
                    Last attempted: {new Date(error.lastIncorrectAt).toLocaleDateString()}
                  </span>
                  <a
                    href={`/quiz/${error.question.subject}?question=${error.questionId}`}
                    className="text-sm font-medium hover:opacity-70"
                    style={{ color: 'var(--accent)' }}
                  >
                    Practice Again →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
