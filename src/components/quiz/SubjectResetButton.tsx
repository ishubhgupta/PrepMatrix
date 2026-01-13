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
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-opacity hover:opacity-70 border"
        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
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
          <div className="relative w-full max-w-md rounded-lg shadow-xl p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <AlertTriangle className="h-6 w-6" style={{ color: '#ef4444' }} />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
                  Reset {subjectName} Progress?
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  This will permanently delete all your progress for this subject including:
                </p>
                <ul className="text-sm mb-6 space-y-1 list-disc list-inside" style={{ color: 'var(--text-muted)' }}>
                  <li>All answered questions ({progress.answeredQuestions} questions)</li>
                  <li>Your accuracy stats ({Math.round(progress.accuracy * 100)}%)</li>
                  <li>All notes and flags for this subject</li>
                </ul>
                <p className="text-sm font-medium" style={{ color: '#ef4444' }}>
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowConfirmation(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#ef4444' }}
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
