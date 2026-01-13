import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ContentCharts } from '@/components/dashboard/ContentCharts';
import { AIFeaturesSection } from '@/components/dashboard/AIFeaturesSection';
import { subjects, getQuestionStats } from '@/data';
import { Target, Brain, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const stats = getQuestionStats();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Clean and Minimal */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text-strong)', letterSpacing: '0.02em' }}>
              Master Technical Interviews
            </h1>
            <div className="w-20 h-1 mx-auto rounded-full mb-6" style={{ background: 'var(--accent)' }}></div>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {stats.total} curated questions. AI-powered explanations. Real interview preparation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/quiz/DBMS/" 
              className="btn btn-primary px-8 py-4 text-base shadow-[var(--shadow-soft)]"
            >
              Start Practicing
            </Link>
            
            <Link 
              href="/progress/" 
              className="btn btn-secondary px-8 py-4 text-base"
            >
              Track Progress
            </Link>
          </div>

          {/* Value Prop - Creative Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                <Target className="w-7 h-7" style={{ color: 'var(--accent)' }} strokeWidth={2} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
                Focused Practice
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Interview-grade questions across DBMS, ML, OOP, GenAI & OS
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                <Brain className="w-7 h-7" style={{ color: 'var(--accent)' }} strokeWidth={2} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
                AI Tutor
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Get explanations, generate similar questions, chat for help
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                <TrendingUp className="w-7 h-7" style={{ color: 'var(--accent)' }} strokeWidth={2} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
                Track Growth
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Monitor accuracy, streaks, and subject mastery over time
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <StatsOverview />

        {/* Content Charts */}
        <div className="mb-16">
          <ContentCharts />
        </div>

        {/* Subject Cards */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-strong)' }}>
              Choose Your Path
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Each subject contains real interview questions with detailed solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>

        {/* AI Features - Scroll animated section */}
        <AIFeaturesSection />
      </main>
    </div>
  );
}
