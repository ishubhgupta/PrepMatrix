import { Header } from '@/components/layout/Header';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ContentCharts } from '@/components/dashboard/ContentCharts';

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50/30 to-purple-50/50 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-purple-200 dark:from-primary-900/20 dark:to-purple-900/20 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full opacity-40 animate-pulse animation-delay-2000"></div>
      </div>
      
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

        {/* Achievement Section */}
        <div className="card p-8 md:p-12 text-center bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent mb-4">
              Achievements & Milestones
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300">
              Celebrate your learning milestones and achievements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-800/50 transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">
                First Quiz Completed
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                You've started your learning journey!
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">
                Streak Builder
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                Maintain your learning momentum!
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-800/50 transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 mb-2">
                AI Explorer
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Unlock the power of AI-assisted learning!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
