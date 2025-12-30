import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ContentCharts } from '@/components/dashboard/ContentCharts';
import { FloatingParticles } from '@/components/ui/LoadingSpinner';
import { subjects, getQuestionStats } from '@/data';

export default function HomePage() {
  const stats = getQuestionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50/30 to-purple-50/50 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-900">
      {/* Floating particles background */}
      <FloatingParticles />
      

      
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-secondary-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
              Master Technical
            </h1>
            <div className="relative">
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 dark:from-primary-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Interviews
              </h1>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-secondary-600 dark:text-secondary-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Practice with <span className="font-bold text-primary-600 dark:text-primary-400">{stats.total}</span> curated questions across 
            <span className="font-semibold text-blue-600 dark:text-blue-400"> DBMS</span>, 
            <span className="font-semibold text-green-600 dark:text-green-400"> Python ML</span>, 
            <span className="font-semibold text-purple-600 dark:text-purple-400"> C++ OOP</span>, and 
            <span className="font-semibold text-orange-600 dark:text-orange-400"> GenAI</span>.
          </p>
          
          <p className="text-lg text-secondary-500 dark:text-secondary-400 max-w-3xl mx-auto mb-10">
            Get instant feedback, AI-powered explanations, and personalized tutoring with cutting-edge technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/quiz/DBMS/" 
              className="btn btn-primary px-8 py-4 text-lg font-semibold shadow-lg"
            >
              <span className="flex items-center space-x-2">
                <span>Start Practicing</span>
              </span>
            </Link>
            
            <Link href="/progress/" className="btn btn-secondary px-8 py-4 text-lg font-semibold bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-lg">
              <span className="flex items-center space-x-2">
                <span>View Progress</span>
                <span className="text-primary-500">📊</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <StatsOverview />

        {/* Content Charts */}
        <div className="mb-12">
          <ContentCharts />
        </div>

        {/* Subject Cards */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              Each subject is carefully crafted with real interview questions and AI-powered learning tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {subjects.map((subject, index) => (
              <div 
                key={subject.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <SubjectCard subject={subject} />
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="relative card p-10 md:p-12 text-center bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-2xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-purple-50/50 dark:from-primary-900/10 dark:via-transparent dark:to-purple-900/10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent mb-6">
              AI-Powered Learning Features
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto mb-12">
              Experience the future of technical interview preparation with our advanced AI tools
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="group">
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative text-3xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  Generate Similar Questions
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                  AI creates new questions similar to ones you're practicing for unlimited practice and deeper understanding.
                </p>
              </div>
              
              <div className="group">
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative text-3xl">💡</span>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Explain Like...
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                  Get explanations tailored to your level - from beginner to advanced, with detailed code examples and concepts.
                </p>
              </div>
              
              <div className="group">
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative text-3xl">👨‍🏫</span>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  Personal AI Tutor
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                  Chat with an AI tutor that understands your learning style and provides personalized guidance.
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <Link 
                href="/settings/" 
                className="group inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-all duration-300"
              >
                <span>AI features powered by Gemini</span>
                <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                  <span>→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
