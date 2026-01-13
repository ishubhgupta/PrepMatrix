'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { CreateQuizModal } from '@/components/custom-quiz/CreateQuizModal';
import { QuizGenerationProgress } from '@/components/custom-quiz/QuizGenerationProgress';
import { useUIStore } from '@/lib/store/ui-store';
import { Sparkles, Plus, Trash2, Play } from 'lucide-react';

interface CustomQuiz {
  id: string;
  name: string;
  description: string;
  status: string;
  questionCount: number;
  targetCount: number;
  progress: number;
  createdAt: string;
}

export default function CustomQuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useUIStore();
  const [quizzes, setQuizzes] = useState<CustomQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeGenerationId, setActiveGenerationId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchQuizzes();
    }
  }, [session]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/custom-quiz/list');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      } else {
        showToast('error', 'Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      showToast('error', 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = (jobId: string) => {
    setActiveGenerationId(jobId);
    setShowCreateModal(false);
    fetchQuizzes();
  };

  const handleGenerationComplete = () => {
    setActiveGenerationId(null);
    fetchQuizzes();
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const response = await fetch(`/api/custom-quiz/${quizId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('success', 'Quiz deleted successfully');
        fetchQuizzes();
      } else {
        showToast('error', 'Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      showToast('error', 'Failed to delete quiz');
    }
  };

  const handleStartQuiz = (quizId: string) => {
    router.push(`/custom-quiz/${quizId}`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-4xl mb-3">⏳</div>
              <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-strong)' }}>
              Custom AI Quiz
            </h1>
          </div>
          <p className="text-lg mb-6" style={{ color: 'var(--text-muted)' }}>
            Create personalized quizzes with AI. Practice exactly what you need to master.
          </p>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Quiz
          </button>
        </div>

        {/* Active Generation Progress */}
        {activeGenerationId && (
          <QuizGenerationProgress 
            jobId={activeGenerationId}
            onComplete={handleGenerationComplete}
          />
        )}

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4 opacity-20">🎯</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
              No Custom Quizzes Yet
            </h3>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              Create your first AI-generated quiz to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold line-clamp-2 flex-1 pr-2" style={{ color: 'var(--text-strong)' }}>
                    {quiz.name}
                  </h3>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                    style={{ color: '#b3261e' }}
                    title="Delete quiz"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                  {quiz.description}
                </p>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`badge ${
                      quiz.status === 'ready' ? 'badge-success' :
                      quiz.status === 'generating' ? 'badge-warning' :
                      quiz.status === 'failed' ? 'badge-error' :
                      'badge-info'
                    }`}
                  >
                    {quiz.status}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {quiz.questionCount} / {quiz.targetCount} questions
                  </span>
                </div>

                {/* Progress Bar for Generating */}
                {quiz.status === 'generating' && (
                  <div className="mb-4">
                    <div className="w-full rounded-full h-2" style={{ background: 'var(--bg-secondary)' }}>
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${quiz.progress}%`,
                          background: 'var(--accent)',
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {quiz.status === 'ready' && (
                  <button
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Quiz
                  </button>
                )}

                {quiz.status === 'failed' && (
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="btn-secondary w-full"
                  >
                    Remove
                  </button>
                )}

                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  Created {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <CreateQuizModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateQuiz}
        />
      )}
    </div>
  );
}
