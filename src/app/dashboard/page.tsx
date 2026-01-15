'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { LearningInsights } from '@/components/dashboard/LearningInsights';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ContentCharts } from '@/components/dashboard/ContentCharts';
import { subjects } from '@/data';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent align-[-0.125em] mb-4" style={{ color: 'var(--accent)' }}></div>
              <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-strong)' }}>
                Welcome back, {session.user.name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                Let's continue your learning journey
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Overview */}
        <StatsOverview />

        {/* Learning Insights Dashboard */}
        <LearningInsights />

        {/* Performance Analytics */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
              Performance Analytics
            </h2>
          </div>
          <ContentCharts />
        </div>

        {/* Recent Activity */}
        <RecentActivity />

        {/* Subject Cards */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
              Practice by Subject
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
