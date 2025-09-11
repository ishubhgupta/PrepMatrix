import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { QuickFilters } from '@/components/dashboard/QuickFilters';
import { ContentCharts } from '@/components/dashboard/ContentCharts';
import { subjects, getQuestionStats } from '@/data';

export default function HomePage() {
  const stats = getQuestionStats();

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
            Master Technical Interviews
          </h1>
          <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto mb-8">
            Practice with {stats.total} curated questions across DBMS, Python ML, C++ OOP, and GenAI. 
            Get instant feedback, AI-powered explanations, and personalized tutoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz/DBMS" className="btn btn-primary">
              Start Practicing
            </Link>
            <button className="btn btn-secondary">
              View Progress
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <StatsOverview />

        {/* Quick Filters */}
        <div className="mb-8">
          <QuickFilters />
        </div>

        {/* Content Charts */}
        <div className="mb-12">
          <ContentCharts />
        </div>

        {/* Subject Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
            Choose Your Subject
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
            AI-Powered Learning Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 dark:text-primary-400 text-xl">🤖</span>
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
                Generate Similar Questions
              </h3>
              <p className="text-secondary-600 dark:text-secondary-300 text-sm">
                AI creates new questions similar to ones you're practicing for unlimited practice.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 dark:text-primary-400 text-xl">💡</span>
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
                Explain Like...
              </h3>
              <p className="text-secondary-600 dark:text-secondary-300 text-sm">
                Get explanations tailored to your level - from beginner to advanced, with code examples.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 dark:text-primary-400 text-xl">👨‍🏫</span>
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
                Personal Tutor
              </h3>
              <p className="text-secondary-600 dark:text-secondary-300 text-sm">
                Chat with an AI tutor that helps you understand concepts and guides your learning.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/settings" className="text-primary-600 dark:text-primary-400 hover:underline">
              Add your Gemini API key to unlock AI features →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
