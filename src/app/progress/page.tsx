import { Header } from '@/components/layout/Header';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ContentCharts } from '@/components/dashboard/ContentCharts';

export default function ProgressPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-bone)' }}>
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-strong)' }}>
            Your Learning Progress
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Track your journey, analyze your performance, and identify areas for improvement
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Charts Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-strong)' }}>
              Performance Analytics
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              Detailed insights into your learning patterns and progress
            </p>
          </div>
          <ContentCharts />
        </div>
      </main>
    </div>
  );
}
