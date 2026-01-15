'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUIStore } from '@/lib/store/ui-store';
import { Header } from '@/components/layout/Header';
import { Award, Clock, TrendingUp, MessageSquare, Target, ChevronDown, ChevronUp, Play, Home, Volume2, Pause } from 'lucide-react';

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
  questionAudioUrl?: string | null;
  answerAudioUrl?: string | null;
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
  const { showToast } = useUIStore();
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [playingAudio, setPlayingAudio] = useState<{type: 'question' | 'answer', number: number} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results');
      }

      // Check if still processing
      if (data.status === 'processing') {
        setError('Your interview results are being processed. Please wait...');
        showToast('info', 'Processing your interview results...', 3000);
        // Retry after 3 seconds
        setTimeout(() => {
          fetchResults();
        }, 3000);
        return;
      }

      // Map data to results format
      setResults({
        overallScore: data.overallScore,
        technicalAccuracy: data.averageScores.technical,
        communicationScore: data.averageScores.clarity,
        depthScore: data.averageScores.depth,
        confidenceScore: data.averageScores.confidence,
        duration: data.duration,
        voiceMetrics: {
          avgSpeakingPace: data.questions[0]?.wordsPerMinute || 0,
          totalFillerWords: data.questions.reduce((sum: number, q: any) => sum + (q.fillerWordCount || 0), 0),
          totalSpeakingTime: data.duration,
          longestPause: Math.max(...data.questions.map((q: any) => q.longestPause || 0)),
        },
        overallFeedback: data.feedback,
        questionResults: data.questions.map((q: any) => ({
          number: q.number,
          question: q.question,
          answer: q.userAnswer || '',
          questionAudioUrl: q.questionAudioUrl,
          answerAudioUrl: q.answerAudioUrl,
          scores: {
            technical: q.technicalScore || 0,
            clarity: q.clarityScore || 0,
            depth: q.depthScore || 0,
            confidence: q.confidenceScore || 0,
          },
          feedback: q.feedback || 'Processing...',
          strengths: q.strengths || [],
          weaknesses: q.weaknesses || [],
          voiceMetrics: {
            wpm: q.wordsPerMinute || 0,
            fillers: q.fillerWordCount || 0,
            duration: q.speakingDuration || 0,
          },
        })),
      });
      setError(''); // Clear any previous errors
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
    if (!feedback || feedback === 'Processing feedback...') {
      return <p style={{ color: 'var(--text-muted)' }}>Feedback is being generated...</p>;
    }

    const lines = feedback.split('\n');
    const formatted: JSX.Element[] = [];
    let currentListItems: string[] = [];

    const flushList = () => {
      if (currentListItems.length > 0) {
        formatted.push(
          <ul key={`list-${formatted.length}`} className="list-none space-y-2 mb-4 ml-4">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1.5" style={{ color: 'var(--accent)' }}>•</span>
                <span className="flex-1" style={{ color: 'var(--text-normal)' }}>{item}</span>
              </li>
            ))}
          </ul>
        );
        currentListItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        flushList();
        return;
      }

      // Headers
      if (trimmed.startsWith('##')) {
        flushList();
        const headerText = trimmed.replace(/^##\s*/, '');
        formatted.push(
          <h3 key={`h-${index}`} className="text-xl font-bold mt-8 mb-4 first:mt-0" style={{ color: 'var(--text-strong)' }}>
            {headerText}
          </h3>
        );
      } else if (trimmed.startsWith('#') && !trimmed.startsWith('##')) {
        flushList();
        const headerText = trimmed.replace(/^#\s*/, '');
        formatted.push(
          <h2 key={`h1-${index}`} className="text-2xl font-bold mt-8 mb-4 first:mt-0" style={{ color: 'var(--text-strong)' }}>
            {headerText}
          </h2>
        );
      }
      // Bullet points
      else if (trimmed.match(/^[-•*]\s+/)) {
        const itemText = trimmed.replace(/^[-•*]\s+/, '');
        currentListItems.push(itemText);
      }
      // Paragraphs with bold text
      else if (trimmed.includes('**')) {
        flushList();
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        formatted.push(
          <p key={`p-${index}`} className="mb-4 leading-relaxed" style={{ color: 'var(--text-normal)' }}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
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

    flushList();
    return <div className="max-w-none">{formatted}</div>;
  };

  // Audio playback functions
  const playAudio = (audioUrl: string, type: 'question' | 'answer', questionNumber: number) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Check if it's a TTS marker (JSON string)
    try {
      const audioData = JSON.parse(audioUrl);
      if (audioData.text) {
        // Use Web Speech API to replay the question
        const utterance = new SpeechSynthesisUtterance(audioData.text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setPlayingAudio(null);
        utterance.onerror = () => setPlayingAudio(null);
        
        speechSynthesis.speak(utterance);
        setPlayingAudio({ type, number: questionNumber });
        return;
      }
    } catch (e) {
      // Not JSON, treat as base64 audio
    }

    // Play recorded audio
    const audio = new Audio(audioUrl);
    audio.onended = () => setPlayingAudio(null);
    audio.onerror = () => setPlayingAudio(null);
    audio.play();
    audioRef.current = audio;
    setPlayingAudio({ type, number: questionNumber });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    speechSynthesis.cancel();
    setPlayingAudio(null);
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
                    {/* Audio Playback Controls */}
                    {(q.questionAudioUrl || q.answerAudioUrl) && (
                      <div className="flex flex-wrap gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.05)' }}>
                        {q.questionAudioUrl && (
                          <button
                            onClick={() => {
                              if (playingAudio?.type === 'question' && playingAudio?.number === q.number) {
                                stopAudio();
                              } else {
                                playAudio(q.questionAudioUrl!, 'question', q.number);
                              }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                            style={{ 
                              backgroundColor: playingAudio?.type === 'question' && playingAudio?.number === q.number 
                                ? 'var(--accent)' 
                                : 'white',
                              color: playingAudio?.type === 'question' && playingAudio?.number === q.number 
                                ? 'white' 
                                : 'var(--text-strong)',
                              border: '2px solid var(--accent)'
                            }}
                          >
                            {playingAudio?.type === 'question' && playingAudio?.number === q.number ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                            <span className="text-sm">
                              {playingAudio?.type === 'question' && playingAudio?.number === q.number ? 'Stop' : 'Play'} AI Question
                            </span>
                          </button>
                        )}
                        {q.answerAudioUrl && (
                          <button
                            onClick={() => {
                              if (playingAudio?.type === 'answer' && playingAudio?.number === q.number) {
                                stopAudio();
                              } else {
                                playAudio(q.answerAudioUrl!, 'answer', q.number);
                              }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                            style={{ 
                              backgroundColor: playingAudio?.type === 'answer' && playingAudio?.number === q.number 
                                ? '#10b981' 
                                : 'white',
                              color: playingAudio?.type === 'answer' && playingAudio?.number === q.number 
                                ? 'white' 
                                : 'var(--text-strong)',
                              border: '2px solid #10b981'
                            }}
                          >
                            {playingAudio?.type === 'answer' && playingAudio?.number === q.number ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                            <span className="text-sm">
                              {playingAudio?.type === 'answer' && playingAudio?.number === q.number ? 'Stop' : 'Play'} Your Answer
                            </span>
                          </button>
                        )}
                      </div>
                    )}

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
