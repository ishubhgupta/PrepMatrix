'use client';

import { useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { SimpleToast } from './Toast';

interface AIResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  type: 'question' | 'explanation';
}

export function AIResponseModal({ isOpen, onClose, title, content, type }: AIResponseModalProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatContent = (text: string) => {
    // Parse the generated question format if it's a question type
    if (type === 'question') {
      const lines = text.split('\n').filter(line => line.trim());
      const questionLine = lines.find(line => line.startsWith('QUESTION:'));
      const options = lines.filter(line => /^[A-D]\)/.test(line.trim()));
      const correctLine = lines.find(line => line.startsWith('CORRECT:'));
      const explanationLine = lines.find(line => line.startsWith('EXPLANATION:'));

      if (questionLine) {
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-secondary-900 dark:text-white mb-2">Question:</h4>
              <p className="text-secondary-700 dark:text-secondary-300">
                {questionLine.replace('QUESTION:', '').trim()}
              </p>
            </div>
            
            {options.length > 0 && (
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-white mb-2">Options:</h4>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <p key={index} className="text-secondary-700 dark:text-secondary-300 pl-2">
                      {option}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {correctLine && (
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-white mb-2">Correct Answer:</h4>
                <p className="text-green-700 dark:text-green-300 font-medium">
                  {correctLine.replace('CORRECT:', '').trim()}
                </p>
              </div>
            )}
            
            {explanationLine && (
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-white mb-2">Explanation:</h4>
                <p className="text-secondary-700 dark:text-secondary-300">
                  {explanationLine.replace('EXPLANATION:', '').trim()}
                </p>
              </div>
            )}
          </div>
        );
      }
    }

    // For explanations or unformatted content, show as paragraphs
    return (
      <div className="space-y-3">
        {text.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
            {paragraph.trim()}
          </p>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-secondary-800 rounded-lg shadow-xl animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {title}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="p-2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {formatContent(content)}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-secondary-200 dark:border-secondary-700">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="btn btn-primary"
            >
              {copied ? 'Copied!' : 'Copy Content'}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <SimpleToast
        message="Content copied to clipboard!"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
