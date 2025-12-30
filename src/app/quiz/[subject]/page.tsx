import { Header } from '@/components/layout/Header';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { subjects, getQuestionsBySubject } from '@/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SubjectResetButton } from '@/components/quiz/SubjectResetButton';

interface QuizPageProps {
  params: Promise<{
    subject: string;
  }>;
}

export async function generateStaticParams() {
  // Generate params for all subjects and their lowercase variations
  const params: { subject: string }[] = [];
  
  subjects.forEach((subject) => {
    // Add the original case
    params.push({ subject: subject.id });
    // Add lowercase version
    if (subject.id !== subject.id.toLowerCase()) {
      params.push({ subject: subject.id.toLowerCase() });
    }
    // Add common typos/variations
    if (subject.id === 'CppOOP') {
      params.push({ subject: 'CppOPP' }); // Common typo
      params.push({ subject: 'cppopp' }); // Lowercase typo
    }
    if (subject.id === 'GenAI') {
      params.push({ subject: 'genAI' }); // Mixed case
    }
  });
  
  return params;
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { subject: subjectId } = await params;
  // Case-insensitive lookup
  const subject = subjects.find(s => s.id.toLowerCase() === subjectId.toLowerCase());
  
  if (!subject) {
    return {
      title: 'Subject Not Found - PrepMatrix',
    };
  }

  return {
    title: `${subject.name} Quiz - PrepMatrix`,
    description: subject.description,
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { subject: subjectId } = await params;
  // Case-insensitive lookup
  const subject = subjects.find(s => s.id.toLowerCase() === subjectId.toLowerCase());
  
  if (!subject) {
    notFound();
  }

  const questions = getQuestionsBySubject(subject.id);

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
                {subject.name}
              </h1>
              <p className="text-secondary-600 dark:text-secondary-300">
                {subject.description} • {questions.length} questions
              </p>
            </div>
            <SubjectResetButton subjectId={subject.id} subjectName={subject.name} />
          </div>
        </div>

        <QuizContainer questions={questions} subject={subject} />
      </main>
    </div>
  );
}
