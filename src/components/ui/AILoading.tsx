'use client';

import { Brain, Loader2 } from 'lucide-react';

interface AILoadingProps {
  isVisible: boolean;
  message: string;
}

export function AILoading({ isVisible, message }: AILoadingProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
      
      {/* Loading Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative rounded-lg shadow-xl p-6 flex items-center space-x-4" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="relative">
            <Brain className="h-8 w-8" style={{ color: 'var(--accent)' }} />
            <Loader2 className="absolute inset-0 h-8 w-8 animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="font-medium" style={{ color: 'var(--text-strong)' }}>
              AI is thinking...
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
