'use client';

import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';
import { useRouter } from 'next/navigation';
import { Mic, Square, Send, Volume2, AlertCircle, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  number: number;
  text: string;
  isFollowUp?: boolean;
}

interface VoiceMetrics {
  wpm: number;
  fillers: number;
  clarity: string;
}

interface Evaluation {
  technicalScore: number;
  clarityScore: number;
  depthScore: number;
  confidenceScore: number;
  feedback: string;
  voiceMetrics: VoiceMetrics;
}

export default function VoiceInterviewSession({ 
  interviewId, 
  initialQuestion 
}: { 
  interviewId: string;
  initialQuestion: Question;
}) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState<Question>(initialQuestion);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(1);
  
  const startTimeRef = useRef<number>(0);
  
  const {
    transcript,
    interimTranscript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
    isBrowserSupported: speechSupported,
  } = useSpeechRecognition();

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isBrowserSupported: ttsSupported,
  } = useTextToSpeech();

  // Auto-speak question and then auto-start recording for real-time flow
  useEffect(() => {
    if (currentQuestion && !isAnswering && !isSubmitting) {
      // Speak the question
      speak(currentQuestion.text);
      
      // Auto-start recording after AI finishes speaking (estimate 3-5 seconds based on question length)
      const words = currentQuestion.text.split(' ').length;
      const estimatedSpeakTime = (words / 2.5) * 1000; // ~150 WPM = 2.5 words/sec
      const delayTime = Math.max(3000, Math.min(estimatedSpeakTime + 1000, 8000));
      
      const autoStartTimer = setTimeout(() => {
        if (!isAnswering && !isSubmitting) {
          handleStartAnswering();
        }
      }, delayTime);
      
      return () => clearTimeout(autoStartTimer);
    }
  }, [currentQuestion]);

  // Check browser support
  useEffect(() => {
    if (!speechSupported || !ttsSupported) {
      setError('Voice features are not supported in this browser. Please use Chrome or Edge.');
    }
  }, [speechSupported, ttsSupported]);

  const handleStartAnswering = () => {
    stopSpeaking();
    setIsAnswering(true);
    setError(null);
    resetTranscript();
    startTimeRef.current = Date.now();
    startListening();
  };

  const handleStopAnswering = () => {
    stopListening();
    setIsAnswering(false);
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const speakingDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const response = await fetch('/api/mock-interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          questionId: currentQuestion.id,
          answer: transcript,
          transcript: transcript,
          speakingDuration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answer');
      }

      // Check if interview is complete
      if (data.interviewComplete) {
        setInterviewComplete(true);
      } else if (data.nextQuestion) {
        // Immediately move to next question for real-time flow
        setCurrentQuestion(data.nextQuestion);
        setQuestionCount(prev => prev + 1);
        resetTranscript();
      }
    } catch (err: any) {
      console.error('Error submitting answer:', err);
      setError(err.message || 'Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteInterview = async () => {
    try {
      const response = await fetch(`/api/mock-interview/${interviewId}/complete`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete interview');
      }

      // Navigate to results page
      router.push(`/mock-interview/results/${interviewId}`);
    } catch (err: any) {
      console.error('Error completing interview:', err);
      setError(err.message || 'Failed to complete interview');
    }
  };

  // Display error if browser not supported
  if (!speechSupported || !ttsSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="card p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#ef4444' }} />
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-strong)' }}>
            Browser Not Supported
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            Voice interview features require Chrome or Edge browser with microphone access.
          </p>
          <button
            onClick={() => router.push('/mock-interview')}
            className="px-6 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Return to Mock Interview
          </button>
        </div>
      </div>
    );
  }

  // Interview complete screen
  if (interviewComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="card p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#10b981' }} />
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-strong)' }}>
            Interview Complete!
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            Great job! Click below to view your detailed feedback and performance analysis.
          </p>
          <button
            onClick={handleCompleteInterview}
            className="px-8 py-3 rounded-lg font-semibold transition-all"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  // Main interview UI
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
              Mock Interview Session
            </div>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-strong)' }}>
              Question {questionCount} of 5
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to end the interview early?')) {
                handleCompleteInterview();
              }
            }}
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-muted)',
            }}
          >
            End Interview
          </button>
        </div>

        {/* Question Display */}
        <div className="card p-8 mb-6">
          <div className="flex items-start gap-4">
            {isSpeaking && !isAnswering && (
              <div className="flex-shrink-0">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: 'var(--accent-soft)' }}
                >
                  <Volume2 className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>
                Question:
              </div>
              <h2 className="text-xl md:text-2xl font-semibold leading-relaxed" style={{ color: 'var(--text-strong)' }}>
                {currentQuestion.text}
              </h2>
            </div>
          </div>
        </div>

        {/* Transcript Display */}
        <div className="card p-6 mb-6 min-h-[250px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
              {isAnswering && <Mic className="w-5 h-5 text-red-500 animate-pulse" />}
              {isAnswering ? 'Recording Your Answer' : isSpeaking ? 'AI Speaking' : 'Your Answer'}
            </h3>
            {isListening && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-500 font-medium">Live</span>
              </div>
            )}
          </div>
          <div className="text-lg leading-relaxed p-4 rounded-lg min-h-[150px]" style={{ 
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-normal)',
          }}>
            {transcript || interimTranscript || (
              <span style={{ color: 'var(--text-muted)' }}>
                {isAnswering ? 'Speak your answer...' : isSpeaking ? 'Listen to the question...' : 'Waiting to start recording...'}
              </span>
            )}
            {interimTranscript && (
              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}> {interimTranscript}</span>
            )}
          </div>
        </div>

        {/* Error Display */}
        {(error || speechError) && (
          <div className="card p-4 mb-6" style={{ 
            backgroundColor: '#fef2f2',
            border: '1px solid #ef4444',
          }}>
            <p className="text-sm flex items-center gap-2" style={{ color: '#ef4444' }}>
              <AlertCircle className="w-4 h-4" />
              {error || speechError}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {!isAnswering ? (
            <>
              {!isSpeaking && (
                <button
                  onClick={handleStartAnswering}
                  disabled={isSpeaking || isSubmitting}
                  className="px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#10b981', color: 'white' }}
                >
                  <Mic className="w-5 h-5" />
                  Start Answering
                </button>
              )}
              {transcript && !isSubmitting && (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || isSpeaking}
                  className="px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  <Send className="w-5 h-5" />
                  Submit & Continue
                </button>
              )}
              {isSubmitting && (
                <div className="text-center py-4" style={{ color: 'var(--text-normal)' }}>
                  <div className="inline-flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5" style={{ color: 'var(--accent)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing your answer...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleStopAnswering}
              disabled={isSubmitting}
              className="px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
