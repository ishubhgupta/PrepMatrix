'use client';

import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'danger';
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    success: 'border-success-600',
    danger: 'border-danger-600'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="relative">
            <div className={`${sizeClasses[size]} border-4 border-secondary-200 dark:border-secondary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
            <div className={`absolute inset-0 ${sizeClasses[size]} border-4 ${colorClasses[color]} border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto`}></div>
          </div>
          {text && (
            <p className={`${textSizeClasses[size]} text-secondary-600 dark:text-secondary-300 font-medium`}>
              {text}{dots}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-secondary-200 dark:border-secondary-700 border-t-transparent rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 ${colorClasses[color]} border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
      </div>
      {text && (
        <span className={`${textSizeClasses[size]} text-secondary-600 dark:text-secondary-300 font-medium`}>
          {text}{dots}
        </span>
      )}
    </div>
  );
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-secondary-200 dark:bg-secondary-700 rounded-lg"></div>
        <div className="w-16 h-6 bg-secondary-200 dark:bg-secondary-700 rounded-full"></div>
      </div>
      <div className="w-3/4 h-6 bg-secondary-200 dark:bg-secondary-700 rounded mb-2"></div>
      <div className="w-full h-4 bg-secondary-200 dark:bg-secondary-700 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
        <div className="flex justify-between">
          <div className="w-16 h-3 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
          <div className="w-12 h-3 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="card p-6 text-center animate-pulse">
          <div className="w-12 h-8 bg-secondary-200 dark:bg-secondary-700 rounded mx-auto mb-2"></div>
          <div className="w-16 h-4 bg-secondary-200 dark:bg-secondary-700 rounded mx-auto mb-1"></div>
          <div className="w-20 h-3 bg-secondary-200 dark:bg-secondary-700 rounded mx-auto"></div>
        </div>
      ))}
    </div>
  );
}

// Floating particles background
export function FloatingParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary-300/20 dark:bg-primary-700/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        ></div>
      ))}
    </div>
  );
}
