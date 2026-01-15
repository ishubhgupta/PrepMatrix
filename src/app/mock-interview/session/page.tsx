'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import VoiceInterviewSession from '@/components/mock-interview/VoiceInterviewSession';

function InterviewSessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const [interviewData, setInterviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const interviewId = searchParams.get('id');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && interviewId) {
      // Fetch interview data
      fetchInterviewData();
    }
  }, [status, interviewId]);

  const fetchInterviewData = async () => {
    try {
      // Fetch full interview with all questions
      const response = await fetch(`/api/mock-interview/${interviewId}/questions`);
      const data = await response.json();
      
      if (data.success) {
        setInterviewData({
          interview: { id: interviewId },
          allQuestions: data.questions,
          currentQuestion: data.questions[0], // Start with first question
          totalQuestions: data.questions.length,
        });
      }
    } catch (error) {
      console.error('Error fetching interview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--accent-soft)' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading interview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--text-muted)' }}>Interview not found</p>
          <button
            onClick={() => router.push('/mock-interview')}
            className="mt-4 px-6 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Back to Mock Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <VoiceInterviewSession
      interviewId={interviewData.interview.id}
      initialQuestion={interviewData.currentQuestion}
      allQuestions={interviewData.allQuestions}
      totalQuestions={interviewData.totalQuestions}
    />
  );
}

export default function InterviewSessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--accent-soft)' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading interview...</p>
          </div>
        </div>
      </div>
    }>
      <InterviewSessionContent />
    </Suspense>
  );
}
