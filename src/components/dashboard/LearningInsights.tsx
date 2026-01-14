'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Brain, AlertCircle, TrendingUp, Target, Lightbulb, CheckCircle } from 'lucide-react';

interface Insight {
  type: 'confusion' | 'gap' | 'focus' | 'progress';
  insight: string;
  severity: 'high' | 'medium' | 'low';
}

interface LearningInsightsData {
  hasData: boolean;
  message?: string;
  aiInsights?: Insight[];
  stats?: {
    totalAnswered: number;
    totalCorrect: number;
    overallAccuracy: number;
    totalIncorrect: number;
  };
  weakestTopics?: Array<{ topic: string; mistakes: number }>;
  weakestSubjects?: Array<{ subject: string; accuracy: number; correct: number; total: number }>;
  resources?: Array<{
    topic: string;
    suggestions: string[];
  }>;
}

export function LearningInsights() {
  const [mounted, setMounted] = useState(false);
  const [insights, setInsights] = useState<LearningInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/learning-insights');
        if (response.ok) {
          const data = await response.json();
          setInsights(data.insights);
        }
      } catch (error) {
        console.error('Error fetching learning insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [session]);

  if (!mounted || loading) {
    return (
      <div className="mb-16">
        <div className="card p-8 animate-pulse">
          <div className="h-8 w-64 bg-secondary-200 dark:bg-secondary-700 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
            <div className="h-20 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
            <div className="h-20 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if not logged in
  if (!session?.user) {
    return (
      <div className="mb-16">
        <div className="card p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-strong)' }}>
            Learning Insights Dashboard
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--text-muted)' }}>
            Sign in to see AI-generated insights about your learning patterns
          </p>
          <a href="/auth/signin" className="btn btn-primary">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!insights?.hasData) {
    return (
      <div className="mb-16">
        <div className="card p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-strong)' }}>
            Learning Insights Dashboard
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--text-muted)' }}>
            {insights?.message || 'Start answering questions to see your learning insights!'}
          </p>
          <a href="/quiz/DBMS" className="btn btn-primary">
            Start Practicing
          </a>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'confusion':
        return <AlertCircle className="w-5 h-5" />;
      case 'gap':
        return <Target className="w-5 h-5" />;
      case 'focus':
        return <Lightbulb className="w-5 h-5" />;
      case 'progress':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // orange
      case 'low':
        return '#10b981'; // green
      default:
        return 'var(--accent)';
    }
  };

  return (
    <div className="mb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Brain className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'var(--accent)', letterSpacing: '0.15em' }}>
            AI-Powered Analysis
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-strong)' }}>
          Learning Insights Dashboard
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Self-awareness is key to improvement. AI identifies your patterns and suggests specific resources.
        </p>
      </div>

      {/* Stats Summary */}
      {insights.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--accent)' }}>
              {insights.stats.totalAnswered}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Questions Answered
            </div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-semibold mb-1" style={{ color: '#10b981' }}>
              {insights.stats.overallAccuracy}%
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Overall Accuracy
            </div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-semibold mb-1" style={{ color: '#10b981' }}>
              {insights.stats.totalCorrect}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Correct Answers
            </div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-semibold mb-1" style={{ color: '#ef4444' }}>
              {insights.stats.totalIncorrect}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Needs Review
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights.aiInsights && insights.aiInsights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {insights.aiInsights.map((insight, index) => (
            <div 
              key={index} 
              className="card p-6 transition-all hover:shadow-lg"
              style={{
                borderLeft: `4px solid ${getSeverityColor(insight.severity)}`
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{ 
                    backgroundColor: `${getSeverityColor(insight.severity)}20`,
                    color: getSeverityColor(insight.severity)
                  }}
                >
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${getSeverityColor(insight.severity)}20`,
                        color: getSeverityColor(insight.severity)
                      }}
                    >
                      {insight.type}
                    </span>
                    {insight.severity === 'high' && (
                      <span className="text-xs font-medium" style={{ color: '#ef4444' }}>
                        Priority
                      </span>
                    )}
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--text-strong)' }}>
                    {insight.insight}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weakest Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weakest Topics */}
        {insights.weakestTopics && insights.weakestTopics.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-strong)' }}>
                Topics Needing Focus
              </h3>
            </div>
            <div className="space-y-3">
              {insights.weakestTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <span className="font-medium" style={{ color: 'var(--text-strong)' }}>
                    {topic.topic}
                  </span>
                  <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    {topic.mistakes} mistakes
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weakest Subjects */}
        {insights.weakestSubjects && insights.weakestSubjects.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-strong)' }}>
                Subject Performance
              </h3>
            </div>
            <div className="space-y-3">
              {insights.weakestSubjects.map((subject, index) => (
                <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: 'var(--text-strong)' }}>
                      {subject.subject}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: subject.accuracy < 50 ? '#ef4444' : subject.accuracy < 70 ? '#f59e0b' : '#10b981' }}>
                      {subject.accuracy}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div 
                      className="h-full transition-all"
                      style={{ 
                        width: `${subject.accuracy}%`,
                        backgroundColor: subject.accuracy < 50 ? '#ef4444' : subject.accuracy < 70 ? '#f59e0b' : '#10b981'
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {subject.correct} / {subject.total} correct
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggested Resources */}
      {insights.resources && insights.resources.length > 0 && (
        <div className="card p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-strong)' }}>
              Suggested Actions
            </h3>
          </div>
          {insights.resources.map((resource, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h4 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                {resource.topic}
              </h4>
              <ul className="space-y-2">
                {resource.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span style={{ color: 'var(--accent)' }}>•</span>
                    <span style={{ color: 'var(--text-muted)' }}>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
