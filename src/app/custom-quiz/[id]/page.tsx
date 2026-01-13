'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Question } from '@/types';

interface DBQuestion {
  id: string;
  subject: string;
  topic: string;
  difficulty: string;
  questionText: string;
  optionsJson: string;
  correctAnswer: string;
  rationale: string;
}

interface CustomQuiz {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  createdAt: string;
}

export default function CustomQuizPlayPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quiz, setQuiz] = useState<CustomQuiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && !hasFetched) {
      fetchQuizData();
    }
  }, [session, params.id, hasFetched]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      
      // Fetch quiz details
      const quizResponse = await fetch('/api/custom-quiz/list');
      if (!quizResponse.ok) throw new Error('Failed to fetch quiz');
      
      const quizData = await quizResponse.json();
      const currentQuiz = quizData.quizzes?.find((q: CustomQuiz) => q.id === params.id);
      
      if (!currentQuiz) {
        setError('Quiz not found');
        return;
      }
      
      setQuiz(currentQuiz);

      // Fetch questions for this custom quiz
      const questionsResponse = await fetch(`/api/custom-quiz/${params.id}/questions`);
      if (!questionsResponse.ok) throw new Error('Failed to fetch questions');
      
      const questionsData = await questionsResponse.json();
      
      if (!questionsData.questions || questionsData.questions.length === 0) {
        setError('No questions found for this quiz');
        return;
      }
      
      // Transform database questions to UI Question format
      const transformedQuestions: Question[] = questionsData.questions.map((dbQ: DBQuestion) => ({
        id: dbQ.id,
        subject: dbQ.subject as any,
        topic: dbQ.topic,
        difficulty: dbQ.difficulty as 'Easy' | 'Medium' | 'Hard',
        question: dbQ.questionText,
        options: JSON.parse(dbQ.optionsJson).map((text: string, index: number) => ({
          text,
          correct: String.fromCharCode(65 + index) === dbQ.correctAnswer,
        })),
        rationale: dbQ.rationale,
      }));
      
      setQuestions(transformedQuestions);
      setHasFetched(true);
    } catch (err: any) {
      console.error('Error fetching quiz data:', err);
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: 'var(--accent)' }} />
              <p style={{ color: 'var(--text-muted)' }}>Loading quiz...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="card p-8 text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
              Error Loading Quiz
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              {error}
            </p>
            <button
              onClick={() => router.push('/custom-quiz')}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Custom Quizzes
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="card p-8 text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
              No Questions Available
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              This quiz doesn't have any questions yet.
            </p>
            <button
              onClick={() => router.push('/custom-quiz')}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Custom Quizzes
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Quiz Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/custom-quiz')}
            className="flex items-center gap-2 text-sm mb-4 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Custom Quizzes</span>
          </button>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
            {quiz.name}
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {quiz.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>{questions.length} Questions</span>
            <span>•</span>
            <span>Scroll down to answer all questions</span>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              totalQuestions={questions.length}
            />
          ))}
        </div>

        {/* Completion Message */}
        <div className="mt-8 card p-6 text-center" style={{ borderColor: 'var(--accent)', borderWidth: '2px' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
            Quiz Complete! 🎉
          </h3>
          <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
            Review your answers above. Your progress has been automatically saved.
          </p>
          <button
            onClick={() => router.push('/custom-quiz')}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Custom Quizzes
          </button>
        </div>
      </main>
    </div>
  );
}
