'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Play, Brain, AlertTriangle, RotateCcw, Sparkles, BookOpen, Target } from 'lucide-react';

export function QuickActions() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const actions = [
    {
      title: 'Continue Practice',
      description: 'Pick up where you left off',
      icon: Play,
      href: '/quiz/DBMS',
      color: 'var(--accent)',
      bgColor: 'var(--accent-soft)',
    },
    {
      title: 'Review Errors',
      description: 'Learn from mistakes',
      icon: AlertTriangle,
      href: '/errors',
      color: '#ef4444',
      bgColor: '#fef2f2',
    },
    {
      title: 'Spaced Repetition',
      description: 'Questions due for review',
      icon: RotateCcw,
      href: '/confidence',
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      title: 'AI Study Coach',
      description: 'Get personalized plan',
      icon: Brain,
      href: '/study-coach',
      color: '#8b5cf6',
      bgColor: '#faf5ff',
    },
    {
      title: 'Custom Quiz',
      description: 'AI-generated questions',
      icon: Sparkles,
      href: '/custom-quiz',
      color: '#06b6d4',
      bgColor: '#ecfeff',
    },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
          Quick Actions
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="card p-5 transition-all hover:shadow-lg hover:scale-[1.02] group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: action.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: action.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text-strong)' }}>
                    {action.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
