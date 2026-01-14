'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Play, Clock, Award, TrendingUp, Calendar, Plus, X, Mic } from 'lucide-react';

const SUBJECTS = [
  'DBMS',
  'Operating Systems',
  'Python & ML',
  'GenAI & LLMs',
  'C++ & OOP',
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', description: 'Basic concepts and fundamentals' },
  { value: 'intermediate', label: 'Intermediate', description: 'Applied knowledge and scenarios' },
  { value: 'advanced', label: 'Advanced', description: 'Complex problems and system design' },
];

const ROLES = [
  { value: 'software-engineer', label: 'Software Engineer' },
  { value: 'data-engineer', label: 'Data Engineer' },
  { value: 'ml-engineer', label: 'ML Engineer' },
  { value: 'backend-developer', label: 'Backend Developer' },
  { value: 'full-stack-developer', label: 'Full Stack Developer' },
];

interface Interview {
  id: string;
  subject: string;
  difficulty: string;
  role: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  overallScore: number | null;
  technicalAccuracy: number | null;
  communicationScore: number | null;
  depthScore: number | null;
  confidenceScore: number | null;
  questionCount: number;
}

export default function MockInterviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [role, setRole] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');
  const [previousInterviews, setPreviousInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchPreviousInterviews();
    }
  }, [status, router]);

  const fetchPreviousInterviews = async () => {
    try {
      const response = await fetch('/api/mock-interview/list');
      const data = await response.json();
      if (data.success) {
        setPreviousInterviews(data.interviews);
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse">
              <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--accent-soft)' }}></div>
              <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleStartInterview = async () => {
    if (!subject || !difficulty || !role) {
      setError('Please select all options before starting');
      return;
    }

    setIsStarting(true);
    setError('');

    try {
      const response = await fetch('/api/mock-interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, difficulty, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start interview');
      }

      // Close modal and navigate to session
      setShowModal(false);
      router.push(`/mock-interview/session?id=${data.interview.id}&qid=${data.currentQuestion.id}`);
    } catch (err: any) {
      console.error('Error starting interview:', err);
      setError(err.message || 'Failed to start interview. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'var(--text-muted)';
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
              AI Mock Interview
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Practice technical interviews with AI-powered voice conversations
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Interview</span>
          </button>
        </div>

        {/* Previous Interviews or Empty State */}
        {previousInterviews.length === 0 && !loading ? (
          <div className="card p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--accent-soft)' }}>
                <Mic className="w-10 h-10" style={{ color: 'var(--accent)' }} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-strong)' }}>
                No interviews yet
              </h2>
              <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                Start your first mock interview to practice your technical skills and get AI-powered feedback.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                <Play className="w-5 h-5" />
                Start Your First Interview
              </button>
            </div>
          </div>
        ) : previousInterviews.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-strong)' }}>
              Your Interviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previousInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="card p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    if (interview.status === 'completed') {
                      router.push(`/mock-interview/results/${interview.id}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--text-strong)' }}>
                        {interview.subject}
                      </h3>
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="capitalize">{interview.difficulty}</span>
                        <span>•</span>
                        <span>{interview.role.replace(/-/g, ' ')}</span>
                      </div>
                    </div>
                    {interview.status === 'completed' && interview.overallScore && (
                      <div
                        className="text-2xl font-bold"
                        style={{ color: getScoreColor(interview.overallScore) }}
                      >
                        {interview.overallScore}
                      </div>
                    )}
                  </div>

                  {interview.status === 'completed' ? (
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold" style={{ color: getScoreColor(interview.technicalAccuracy) }}>
                          {interview.technicalAccuracy}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Technical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold" style={{ color: getScoreColor(interview.communicationScore) }}>
                          {interview.communicationScore}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Communication</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold" style={{ color: getScoreColor(interview.depthScore) }}>
                          {interview.depthScore}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Depth</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold" style={{ color: getScoreColor(interview.confidenceScore) }}>
                          {interview.confidenceScore}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Confidence</div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3 p-2 rounded text-center text-sm" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      In Progress - {interview.questionCount} questions answered
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(interview.startedAt)}
                      </span>
                      {interview.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(interview.duration)}
                        </span>
                      )}
                    </div>
                    {interview.status === 'completed' && (
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        View Details →
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Create Interview Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
                  Create New Interview
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                  }}
                  className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subject Selection */}
              <div className="mb-6">
                <label className="block font-medium mb-3" style={{ color: 'var(--text-strong)' }}>
                  Select Subject
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SUBJECTS.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSubject(sub)}
                      className={`p-3 rounded-lg font-medium transition-all ${
                        subject === sub ? 'ring-2' : ''
                      }`}
                      style={{
                        backgroundColor: subject === sub ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                        color: subject === sub ? 'var(--accent)' : 'var(--text-normal)',
                        borderColor: subject === sub ? 'var(--accent)' : 'transparent',
                      }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-6">
                <label className="block font-medium mb-3" style={{ color: 'var(--text-strong)' }}>
                  Select Difficulty
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setDifficulty(diff.value)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        difficulty === diff.value ? 'ring-2' : ''
                      }`}
                      style={{
                        backgroundColor: difficulty === diff.value ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                        color: difficulty === diff.value ? 'var(--accent)' : 'var(--text-normal)',
                        borderColor: difficulty === diff.value ? 'var(--accent)' : 'transparent',
                      }}
                    >
                      <div className="font-semibold mb-1">{diff.label}</div>
                      <div className="text-sm opacity-75">{diff.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <label className="block font-medium mb-3" style={{ color: 'var(--text-strong)' }}>
                  Select Target Role
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={`p-3 rounded-lg font-medium transition-all ${
                        role === r.value ? 'ring-2' : ''
                      }`}
                      style={{
                        backgroundColor: role === r.value ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                        color: role === r.value ? 'var(--accent)' : 'var(--text-normal)',
                        borderColor: role === r.value ? 'var(--accent)' : 'transparent',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* Info Box */}
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-soft)', border: '1px solid var(--accent)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>Before you start:</h3>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-normal)' }}>
                  <li>• Ensure your microphone is working</li>
                  <li>• Find a quiet environment</li>
                  <li>• Use Chrome or Edge browser for best experience</li>
                  <li>• Speak clearly and at a natural pace</li>
                </ul>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartInterview}
                disabled={!subject || !difficulty || !role || isStarting}
                className="w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                }}
              >
                {isStarting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Starting Interview...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Interview
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
