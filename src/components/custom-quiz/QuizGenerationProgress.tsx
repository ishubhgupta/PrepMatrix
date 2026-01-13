'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

interface QuizGenerationProgressProps {
  jobId: string;
  onComplete: () => void;
}

export function QuizGenerationProgress({ jobId, onComplete }: QuizGenerationProgressProps) {
  const [status, setStatus] = useState<{
    status: string;
    progress: number;
    questionCount: number;
    targetCount: number;
    name: string;
  } | null>(null);
  const [polling, setPolling] = useState(true);
  const { showToast } = useUIStore();

  useEffect(() => {
    // Poll for status every 2 seconds
    const interval = setInterval(async () => {
      if (!polling) return;

      try {
        const response = await fetch(`/api/custom-quiz/status/${jobId}`);
        const data = await response.json();

        setStatus(data);

        // Check if complete
        if (data.status === 'ready') {
          setPolling(false);
          showToast('success', `Quiz "${data.name}" is ready! 🎉`);
          onComplete();
        } else if (data.status === 'failed') {
          setPolling(false);
          showToast('error', `Quiz generation failed: ${data.errorMessage}`);
          onComplete();
        } else if (data.status === 'cancelled') {
          setPolling(false);
          showToast('info', 'Quiz generation cancelled');
          onComplete();
        }
      } catch (error) {
        console.error('Error polling status:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, polling, onComplete, showToast]);

  const handleCancel = async () => {
    if (!confirm('Cancel quiz generation? Partial progress will be saved.')) return;

    try {
      const response = await fetch(`/api/custom-quiz/status/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPolling(false);
        showToast('info', 'Generation cancelled. Partial questions saved.');
        onComplete();
      }
    } catch (error) {
      console.error('Error cancelling:', error);
    }
  };

  if (!status) {
    return (
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--accent)' }} />
          <span style={{ color: 'var(--text-strong)' }}>Initializing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-6 border-2" style={{ borderColor: 'var(--accent)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-strong)' }}>
            {status.name}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Generating... {status.questionCount}/{status.targetCount} questions ready
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          title="Cancel generation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="h-3 rounded-full transition-all duration-500 flex items-center justify-center text-xs font-semibold text-white"
            style={{
              width: `${status.progress}%`,
              background: 'linear-gradient(90deg, var(--accent) 0%, #8b5cf6 100%)',
            }}
          >
            {status.progress > 10 && `${status.progress}%`}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
          AI is crafting your questions...
        </span>
      </div>
    </div>
  );
}
