'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';
import { Award, Clock, TrendingUp, MessageSquare, Target, ChevronDown, ChevronUp, Play, Home } from 'lucide-react';

interface VoiceMetrics {
  avgSpeakingPace: number;
  totalFillerWords: number;
  totalSpeakingTime: number;
  longestPause: number;
}

interface QuestionResult {
  number: number;
  question: string;
  answer: string;
  scores: {
    technical: number;
    clarity: number;
    depth: number;
    confidence: number;
  };
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  voiceMetrics: {
    wpm: number;
    fillers: number;
    duration: number;
  };
}

interface InterviewResults {
  overallScore: number;
  technicalAccuracy: number;
  communicationScore: number;
  depthScore: number;
  confidenceScore: number;
  duration: number;
  voiceMetrics: VoiceMetrics;
  overallFeedback: string;
  questionResults: QuestionResult[];
}

export default function InterviewResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchResults();
    }
  }, [status]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/mock-interview/${params.id}/complete`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results');
      }

      setResults(data.results);
    } catch (err: any) {
      console.error('Error fetching results:', err);
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse">
              <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--accent-soft)' }}></div>
              <p style={{ color: 'var(--text-muted)' }}>Loading results...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 max-w-md mx-auto text-center">
            <div className="text-red-500 mb-4">Error</div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-strong)' }}>
              Error Loading Results
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>{error || 'Results not found'}</p>
            <button
              onClick={() => router.push('/mock-interview')}
              className="px-6 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              Return to Mock Interview
            </button>
          </div>
        </main>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatFeedback = (feedback: string) => {
    const lines = feedback.split('\n');
    const formatted: JSX.Element[] = [];
    let currentSection: JSX.Element[] = [];
    let currentListItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (currentListItems.length > 0) {
        formatted.push(
          <ul key={`list-${formatted.length}`} className="list-none space-y-2 mb-6">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span style={{ color: 'var(--accent)' }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
        currentListItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        flushList();
        return;
      }

      // Check if it's a header (starts with ##)
      if (trimmed.startsWith('##')) {
        flushList();
        const headerText = trimmed.replace(/^##\s*/, '');
        formatted.push(
          <h3 key={`h-${index}`} className="text-xl font-bold mt-6 mb-3" style={{ color: 'var(--text-strong)' }}>
            {headerText}
          </h3>
        );
      }
      // Check if it's a bullet point (starts with • or -)
      else if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        inList = true;
        const itemText = trimmed.replace(/^[•-]\s*/, '');
        currentListItems.push(itemText);
      }
      // Regular paragraph
      else {
        flushList();
        formatted.push(
          <p key={`p-${index}`} className="mb-4 leading-relaxed" style={{ color: 'var(--text-normal)' }}>
            {trimmed}
          </p>
        );
      }
    });

    flushList(); // Flush any remaining list items

    return <div>{formatted}</div>;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
            Interview Complete!
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Here's your detailed performance analysis
          </p>
        </div>

        {/* Overall Score */}
        <div className="card p-8 mb-8 text-center">
          <div className="mb-4">
            <div 
              className="inline-flex items-center justify-center w-32 h-32 rounded-full ring-8"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: getScoreColor(results.overallScore),
              }}
            >
              <div>
                <div className="text-5xl font-bold" style={{ color: getScoreColor(results.overallScore) }}>
                  {results.overallScore}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Overall</div>
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--text-normal)' }}>Duration: {formatDuration(results.duration)}</p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Technical', score: results.technicalAccuracy, icon: Target },
            { label: 'Communication', score: results.communicationScore, icon: MessageSquare },
            { label: 'Depth', score: results.depthScore, icon: TrendingUp },
            { label: 'Confidence', score: results.confidenceScore, icon: Award },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="card p-6 text-center">
                <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: getScoreColor(item.score) }} />
                <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(item.score) }}>
                  {item.score}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
              </div>
            );
          })}
        </div>



        {/* Overall Feedback */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-strong)' }}>
            Overall Feedback
          </h2>
          <div className="max-w-none">
            {formatFeedback(results.overallFeedback)}
          </div>
        </div>

        {/* Question-by-Question Breakdown */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-strong)' }}>
            Question Breakdown
          </h2>
          <div className="space-y-4">
            {results.questionResults.map((q) => (
              <div
                key={q.number}
                className="rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === q.number ? null : q.number)}
                  className="w-full p-6 text-left hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold" style={{ color: 'var(--accent)' }}>Q{q.number}</span>
                        <div className="flex gap-2 text-sm">
                          <span className="font-semibold" style={{ color: getScoreColor(q.scores.technical) }}>
                            T:{q.scores.technical}
                          </span>
                          <span className="font-semibold" style={{ color: getScoreColor(q.scores.clarity) }}>
                            C:{q.scores.clarity}
                          </span>
                          <span className="font-semibold" style={{ color: getScoreColor(q.scores.depth) }}>
                            D:{q.scores.depth}
                          </span>
                          <span className="font-semibold" style={{ color: getScoreColor(q.scores.confidence) }}>
                            Cf:{q.scores.confidence}
                          </span>
                        </div>
                      </div>
                      <p className="font-medium" style={{ color: 'var(--text-strong)' }}>{q.question}</p>
                    </div>
                    {expandedQuestion === q.number ? (
                      <ChevronUp className="w-6 h-6 flex-shrink-0 ml-4" style={{ color: 'var(--text-muted)' }} />
                    ) : (
                      <ChevronDown className="w-6 h-6 flex-shrink-0 ml-4" style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                </button>

                {expandedQuestion === q.number && (
                  <div className="px-6 pb-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Your Answer:</h4>
                      <p style={{ color: 'var(--text-normal)' }}>{q.answer}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Feedback:</h4>
                      <p className="text-sm" style={{ color: 'var(--text-normal)' }}>{q.feedback}</p>
                    </div>

                    {q.strengths.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2" style={{ color: '#10b981' }}>Strengths:</h4>
                        <ul className="space-y-1">
                          {q.strengths.map((s, i) => (
                            <li key={i} className="text-sm" style={{ color: '#10b981' }}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {q.weaknesses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2" style={{ color: '#f97316' }}>Areas to Improve:</h4>
                        <ul className="space-y-1">
                          {q.weaknesses.map((w, i) => (
                            <li key={i} className="text-sm" style={{ color: '#f97316' }}>• {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/mock-interview')}
            className="px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            <Play className="w-5 h-5" />
            Start New Interview
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-normal)' }}
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
