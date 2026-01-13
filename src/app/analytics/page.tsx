'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';
import { TrendingUp, Calendar, Target, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-bone)' }}>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="card p-8 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
              Sign In Required
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Analytics are only available for authenticated users.
            </p>
            <a href="/auth/signin" className="btn btn-primary mt-6 inline-block">
              Sign In
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-bone)' }}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
            Analytics Dashboard
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Visual progress tracking and insights
          </p>
        </div>

        {/* Coming Soon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
              Activity Heatmap
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Calendar view of daily activity and accuracy
            </p>
            <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
              Coming Soon
            </span>
          </div>

          <div className="card p-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
              Topic Radar Chart
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Mastery levels across all subjects
            </p>
            <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
              Coming Soon
            </span>
          </div>

          <div className="card p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
              Time on Task
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Bar chart showing time spent per topic
            </p>
            <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
              Coming Soon
            </span>
          </div>

          <div className="card p-8 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
              Progress Trends
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Line graphs showing improvement over time
            </p>
            <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
              Coming Soon
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
