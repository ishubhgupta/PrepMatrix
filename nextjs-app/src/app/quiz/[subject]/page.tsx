import { Header } from '@/components/layout/Header';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { subjects, getQuestionsBySubject } from '@/data';
import { notFound } from 'next/navigation';

interface QuizPageProps {
  params: {
    subject: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const subject = subjects.find(s => s.id === params.subject);
  
  if (!subject) {
    notFound();
  }

  const questions = getQuestionsBySubject(params.subject);

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            {subject.name}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            {subject.description} • {questions.length} questions
          </p>
        </div>

        <QuizContainer questions={questions} subject={subject} />
      </main>
    </div>
  );
}
