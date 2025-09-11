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
        <div className="relative bg-white dark:bg-secondary-800 rounded-lg shadow-xl p-6 flex items-center space-x-4">
          <div className="relative">
            <Brain className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <Loader2 className="absolute inset-0 h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
          </div>
          <div>
            <p className="text-secondary-900 dark:text-white font-medium">
              AI is thinking...
            </p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
