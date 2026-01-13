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
    success: <CheckCircle className="w-5 h-5" style={{ color: '#2f9e44' }} />,
    error: <XCircle className="w-5 h-5" style={{ color: '#b3261e' }} />,
    warning: <AlertCircle className="w-5 h-5" style={{ color: '#b46a1d' }} />,
    info: <Info className="w-5 h-5" style={{ color: 'var(--accent)' }} />
  };

  return (
    <div className="relative max-w-sm w-full rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-soft)' }}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {icons[type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-strong)' }}>
              {title}
            </h4>
            {message && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={() => onClose(id)}
            className="flex-shrink-0 p-1 rounded-lg transition-colors duration-200 hover:bg-black/5"
            style={{ color: 'var(--text-muted)' }}
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
