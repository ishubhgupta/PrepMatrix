import { Header } from '@/components/layout/Header';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ContentCharts } from '@/components/dashboard/ContentCharts';

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50/30 to-purple-50/50 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-900">
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Your Learning Progress
          </h1>
          <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            Track your journey, analyze your performance, and identify areas for improvement
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Charts Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent mb-4">
              Performance Analytics
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300">
              Detailed insights into your learning patterns and progress
            </p>
          </div>
          <ContentCharts />
        </div>
      </main>
    </div>
  );
}
