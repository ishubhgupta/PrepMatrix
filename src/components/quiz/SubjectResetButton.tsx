'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useQuizStore } from '@/lib/store/quiz-store';

interface SubjectResetButtonProps {
  subjectId: string;
  subjectName: string;
}

export function SubjectResetButton({ subjectId, subjectName }: SubjectResetButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resetSubjectProgress, getSubjectProgress } = useQuizStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const progress = getSubjectProgress(subjectId);
  const hasProgress = progress.answeredQuestions > 0;

  const handleReset = () => {
    resetSubjectProgress(subjectId);
    setShowConfirmation(false);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !hasProgress) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-800"
        title="Reset progress for this subject"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="hidden sm:inline">Reset Progress</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowConfirmation(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white dark:bg-secondary-800 rounded-lg shadow-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                  Reset {subjectName} Progress?
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                  This will permanently delete all your progress for this subject including:
                </p>
                <ul className="text-sm text-secondary-600 dark:text-secondary-400 mb-6 space-y-1 list-disc list-inside">
                  <li>All answered questions ({progress.answeredQuestions} questions)</li>
                  <li>Your accuracy stats ({Math.round(progress.accuracy * 100)}%)</li>
                  <li>All notes and flags for this subject</li>
                </ul>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
