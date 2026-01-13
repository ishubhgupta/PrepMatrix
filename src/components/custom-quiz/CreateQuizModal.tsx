'use client';

import { useState, useEffect } from 'react';
import { X, Lightbulb, Sparkles } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

interface CreateQuizModalProps {
  onClose: () => void;
  onSuccess: (jobId: string) => void;
}

export function CreateQuizModal({ onClose, onSuccess }: CreateQuizModalProps) {
  const { showToast } = useUIStore();
  const [prompt, setPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState<10 | 30 | 50>(30);
  const [examples, setExamples] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExamples();
  }, []);

  useEffect(() => {
    // Extract keywords as user types (debounced)
    const timer = setTimeout(() => {
      if (prompt.length > 10) {
        const extracted = extractKeywords(prompt);
        setKeywords(extracted);
        
        // Get suggestions based on keywords
        const related = suggestRelatedSubjects(extracted);
        setSuggestions(related);
      } else {
        setKeywords([]);
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [prompt]);

  const fetchExamples = async () => {
    try {
      const response = await fetch('/api/custom-quiz/examples');
      if (response.ok) {
        const data = await response.json();
        setExamples(data.examples || []);
      }
    } catch (error) {
      console.error('Error fetching examples:', error);
    }
  };

  const extractKeywords = (text: string): string[] => {
    const commonWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'i', 'want', 'to', 'practice', 'some', 'question', 'questions', 'on', 'about', 'related', 'topic', 'interview', 'prepare', 'for', 'and', 'or', 'but']);
    
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));
    
    return [...new Set(words)].slice(0, 5);
  };

  const suggestRelatedSubjects = (kws: string[]): string[] => {
    const subjectKeywords: Record<string, string[]> = {
      'DBMS': ['database', 'sql', 'mysql', 'query', 'transaction', 'acid', 'normalization'],
      'Operating Systems': ['os', 'operating', 'system', 'process', 'thread', 'memory', 'cpu', 'scheduling'],
      'GenAI': ['ai', 'artificial', 'intelligence', 'llm', 'gpt', 'prompt', 'model'],
      'C++ OOP': ['cpp', 'c++', 'oop', 'object', 'oriented', 'class', 'inheritance'],
      'Python ML': ['python', 'machine', 'learning', 'ml', 'numpy', 'pandas', 'sklearn'],
    };

    const suggestions: string[] = [];
    const keywordSet = new Set(kws.map(k => k.toLowerCase()));

    for (const [subject, subjectKeys] of Object.entries(subjectKeywords)) {
      if (subjectKeys.some(sk => keywordSet.has(sk))) {
        suggestions.push(subject);
      }
    }

    return suggestions;
  };

  const handleSubmit = async () => {
    if (prompt.trim().length < 10) {
      setError('Please provide a detailed prompt (at least 10 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/custom-quiz/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, questionCount }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Quiz creation started! Generating questions...');
        onSuccess(data.jobId);
      } else {
        setError(data.error || 'Failed to create quiz');
        showToast('error', data.error || 'Failed to create quiz');
      }
    } catch (error) {
      const errorMsg = 'Failed to create quiz. Please try again.';
      setError(errorMsg);
      showToast('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
                Create AI Quiz
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Example Prompts */}
          {examples.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>
                  Suggested based on your mistakes:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="px-3 py-1.5 text-sm rounded-full border-2 border-secondary-200 hover:border-accent hover:bg-accent/5 transition-all"
                    style={{ color: 'var(--text-strong)' }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-strong)' }}>
              What do you want to practice?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'I want to practice Computer Networks TCP/IP and routing protocols' or 'React Hooks and state management'"
              className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-accent outline-none transition-colors resize-none"
              rows={4}
              style={{ 
                background: 'var(--bg-primary)',
                color: 'var(--text-strong)',
              }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {prompt.length} / 10 characters minimum
            </p>
          </div>

          {/* Extracted Keywords */}
          {keywords.length > 0 && (
            <div className="mb-6">
              <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>
                Keywords detected:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{
                      background: 'var(--accent)',
                      color: 'white',
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subject Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-strong)' }}>
                💡 We found related subjects: <strong>{suggestions.join(', ')}</strong>
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Consider practicing those first if you haven't already!
              </p>
            </div>
          )}

          {/* Question Count Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-strong)' }}>
              Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([10, 30, 50] as const).map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    questionCount === count
                      ? 'border-accent bg-accent/10'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {count}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    questions
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
              disabled={loading || prompt.trim().length < 10}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>Generate Quiz</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
