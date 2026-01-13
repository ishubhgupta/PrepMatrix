'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { TrendingUp, TrendingDown, Target, AlertCircle, Brain, CheckCircle } from 'lucide-react';

interface ConfidenceStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  overconfidentCount: number;
  underconfidentCount: number;
  somewhatWrongCount: number;
  overconfidenceRate: number;
  underconfidenceRate: number;
}

interface Attempt {
  id: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  confidence: string;
  timeSpent: number;
  attemptedAt: string;
  question: {
    id: string;
    subject: string;
    topic: string;
    difficulty: string;
    questionText: string;
    correctAnswer: string;
  };
}

interface TopicAnalysis {
  topic: string;
  overconfident: number;
  underconfident: number;
  totalAttempts: number;
  accuracy: number;
}

export default function ConfidenceAnalysisPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ConfidenceStats | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [topicAnalysis, setTopicAnalysis] = useState<TopicAnalysis[]>([]);
  const [filter, setFilter] = useState<'all' | 'overconfident' | 'underconfident'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: filter,
        ...(selectedSubject !== 'all' && { subject: selectedSubject }),
      });

      const response = await fetch(`/api/confidence-analysis?${params}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setAttempts(data.attempts);
        setTopicAnalysis(data.topicAnalysis);
      }
    } catch (error) {
      console.error('Failed to fetch confidence analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, filter, selectedSubject]);

  if (!session?.user) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <Brain className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-strong)' }}>
              Sign In Required
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              Sign in to track your confidence patterns and identify areas for improvement.
            </p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="btn btn-primary"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subjects = ['all', 'GenAI', 'CppOOP', 'DBMS', 'OS', 'PythonML'];

  const getConfidenceEmoji = (confidence: string) => {
    if (confidence === 'very') return '🔥';
    if (confidence === 'somewhat') return '✓';
    return '?';
  };

  const getConfidenceLabel = (confidence: string) => {
    if (confidence === 'very') return 'Very Sure';
    if (confidence === 'somewhat') return 'Somewhat';
    return 'Guessing';
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
            Confidence Analysis
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Discover where you're overconfident or underconfident to improve your calibration
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Attempts</span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text-strong)' }}>
                    {stats.totalAttempts}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {stats.accuracy.toFixed(1)}% accuracy
                  </p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Overconfident</span>
                  </div>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.overconfidentCount}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {stats.overconfidenceRate.toFixed(1)}% of attempts
                  </p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Underconfident</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.underconfidentCount}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {stats.underconfidenceRate.toFixed(1)}% of attempts
                  </p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Somewhat Wrong</span>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.somewhatWrongCount}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Need more practice
                  </p>
                </div>
              </div>
            )}

            {/* Topic Analysis */}
            {topicAnalysis.length > 0 && (
              <div className="card p-6 mb-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-strong)' }}>
                  Confidence by Topic
                </h2>
                <div className="space-y-4">
                  {topicAnalysis.slice(0, 10).map((topic) => (
                    <div key={topic.topic}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium" style={{ color: 'var(--text-strong)' }}>
                          {topic.topic}
                        </span>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-red-600">{topic.overconfident} overconfident</span>
                          <span className="text-blue-600">{topic.underconfident} underconfident</span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {topic.accuracy.toFixed(0)}% accuracy
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-black/5">
                        <div
                          className="bg-red-500"
                          style={{ width: `${(topic.overconfident / topic.totalAttempts) * 100}%` }}
                        />
                        <div
                          className="bg-blue-500"
                          style={{ width: `${(topic.underconfident / topic.totalAttempts) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="card p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === 'all'
                        ? 'bg-[color:var(--accent)] text-white'
                        : 'bg-black/5 hover:bg-black/10'
                    }`}
                  >
                    All Attempts
                  </button>
                  <button
                    onClick={() => setFilter('overconfident')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === 'overconfident'
                        ? 'bg-red-500 text-white'
                        : 'bg-black/5 hover:bg-black/10'
                    }`}
                  >
                    🔥 Overconfident
                  </button>
                  <button
                    onClick={() => setFilter('underconfident')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === 'underconfident'
                        ? 'bg-blue-500 text-white'
                        : 'bg-black/5 hover:bg-black/10'
                    }`}
                  >
                    ? Underconfident
                  </button>
                </div>

                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-black/10 bg-white"
                  style={{ color: 'var(--text-strong)' }}
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attempts List */}
            {attempts.length === 0 ? (
              <div className="card p-12 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
                  {filter === 'all' ? 'No attempts yet' : `No ${filter} attempts`}
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  {filter === 'all' 
                    ? 'Start answering questions to see your confidence analysis'
                    : 'Try changing the filter or keep practicing'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {attempts.map((attempt) => (
                  <div key={attempt.id} className="card p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            attempt.question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            attempt.question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {attempt.question.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-black/5">
                            {attempt.question.subject}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-black/5">
                            {attempt.question.topic}
                          </span>
                        </div>
                        <p className="font-medium mb-2" style={{ color: 'var(--text-strong)' }}>
                          {attempt.question.questionText.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          attempt.isCorrect
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {attempt.isCorrect ? '✓ Correct' : '✗ Wrong'}
                        </span>
                        <span className="text-2xl">
                          {getConfidenceEmoji(attempt.confidence)}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {getConfidenceLabel(attempt.confidence)}
                        </span>
                      </div>
                    </div>

                    {/* Insight */}
                    {attempt.confidence === 'very' && !attempt.isCorrect && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Overconfidence Alert: You were very sure but got it wrong. Review this topic carefully!
                          </span>
                        </div>
                      </div>
                    )}

                    {attempt.confidence === 'guessing' && attempt.isCorrect && (
                      <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700">
                          <Brain className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Lucky Guess: You weren't confident but got it right. Study this to build true understanding!
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>Time: {(attempt.timeSpent / 1000).toFixed(1)}s</span>
                      <span>•</span>
                      <span>{new Date(attempt.attemptedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <button
                        onClick={() => router.push(`/quiz/${attempt.question.subject}#question-${attempt.questionId}`)}
                        className="text-[color:var(--accent)] hover:underline font-medium"
                      >
                        Review Question →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
