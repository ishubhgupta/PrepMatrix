'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-success-600" />,
    error: <XCircle className="w-6 h-6 text-danger-600" />,
    warning: <AlertCircle className="w-6 h-6 text-warning-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />
  };

  const backgrounds = {
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
    error: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800',
    warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  };

  const textColors = {
    success: 'text-success-800 dark:text-success-200',
    error: 'text-danger-800 dark:text-danger-200',
    warning: 'text-warning-800 dark:text-warning-200',
    info: 'text-blue-800 dark:text-blue-200'
  };

  return (
    <div className={`relative max-w-sm w-full ${backgrounds[type]} border rounded-xl shadow-lg backdrop-blur-sm overflow-hidden`}>
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 animate-progress" style={{ animationDuration: `${duration}ms` }}></div>
      
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {icons[type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${textColors[type]} mb-1`}>
              {title}
            </h4>
            {message && (
              <p className={`text-sm ${textColors[type]} opacity-90 leading-relaxed`}>
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={() => onClose(id)}
            className={`flex-shrink-0 p-1 rounded-lg transition-colors duration-200 ${textColors[type]} hover:bg-black/10 dark:hover:bg-white/10`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple toast for backward compatibility
interface SimpleToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function SimpleToast({ message, type, isVisible, onClose, duration = 3000 }: SimpleToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-pink-500',
    info: 'from-blue-500 to-cyan-500',
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`bg-gradient-to-r ${bgColors[type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3 max-w-sm backdrop-blur-sm`}>
        {icons[type]}
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Toast Container
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-3 pointer-events-none">
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
