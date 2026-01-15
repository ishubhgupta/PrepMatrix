'use client';

import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/store/ui-store';
import { Mic, Square, Send, Volume2, AlertCircle, CheckCircle } from 'lucide-react';

// Audio recording utilities
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

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
  initialQuestion,
  allQuestions,
  totalQuestions
}: { 
  interviewId: string;
  initialQuestion: Question;
  allQuestions: Question[];
  totalQuestions: number;
}) {
  const router = useRouter();
  const { showToast } = useUIStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(initialQuestion);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [questionAudioUrl, setQuestionAudioUrl] = useState<string | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
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
      // Reset question audio for new question
      setQuestionAudioUrl(null);
      
      // Capture AI voice as audio
      captureQuestionAudio(currentQuestion.text);
      
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

  // Capture AI question audio using speech synthesis
  const captureQuestionAudio = async (text: string) => {
    try {
      // Use Web Speech API to generate audio and capture it
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Note: Web Speech API doesn't provide direct audio capture
      // We'll generate the audio via TTS and the user can replay via the speak function
      // Store the text for replay purposes
      const audioData = {
        text: text,
        timestamp: Date.now()
      };
      
      // In a production app, you'd use a TTS service that returns audio files
      // For now, we'll just store a marker that we can use to replay
      setQuestionAudioUrl(JSON.stringify(audioData));
    } catch (error) {
      console.error('Error capturing question audio:', error);
    }
  };

  // Start recording user's audio answer
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start();
      setIsRecordingAudio(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      setError('Failed to access microphone for recording');
    }
  };

  // Stop recording and convert to base64
  const stopAudioRecording = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setIsRecordingAudio(false);
          
          // Stop all tracks
          if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          }
          
          resolve(base64Audio);
        };
        
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  };

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
    startAudioRecording(); // Start recording audio
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

    // Stop audio recording and get base64 data
    const answerAudioUrl = await stopAudioRecording();

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
          answerAudioUrl, // Send recorded audio
          questionAudioUrl, // Send question audio marker
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answer');
      }

      console.log('Answer submitted successfully:', {
        currentQuestionId: currentQuestion.id,
        currentQuestionNumber: currentQuestionIndex + 1,
        isComplete: data.isComplete,
      });

      // Check if interview is complete
      if (data.isComplete || data.interviewComplete) {
        // Auto-complete the interview
        await handleCompleteInterview();
      } else {
        // Move to next pre-generated question
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < allQuestions.length) {
          console.log('Moving to next pre-generated question:', {
            from: currentQuestionIndex,
            to: nextIndex,
            questionText: allQuestions[nextIndex].text.substring(0, 50) + '...'
          });
          setCurrentQuestionIndex(nextIndex);
          setCurrentQuestion(allQuestions[nextIndex]);
          resetTranscript();
        } else {
          // All questions answered, complete interview
          await handleCompleteInterview();
        }
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

      // Navigate to mock interview list page with success message
      router.push('/mock-interview');
      
      // Show toast notification
      showToast('success', 'Interview saved successfully! Your results will be ready shortly.');
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

  // Main interview UI
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
              Mock Interview Session
            </div>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-strong)' }}>
              Question {currentQuestionIndex + 1} of {totalQuestions}
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

        {/* Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Question Panel */}
          <div className="card p-6 flex flex-col h-[450px]">
            <div className="flex items-center gap-2 mb-4">
              {isSpeaking && !isAnswering && (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: 'var(--accent-soft)' }}
                >
                  <Volume2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
              )}
              <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                Question {currentQuestionIndex + 1}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-strong)' }}>
                {currentQuestion.text}
              </p>
            </div>
          </div>

          {/* Answer Panel */}
          <div className="card p-6 flex flex-col h-[450px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {isAnswering && <Mic className="w-4 h-4 text-red-500 animate-pulse" />}
                <div className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>
                  {isAnswering ? 'Recording Your Answer' : 'Your Answer'}
                </div>
              </div>
              {isListening && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-500 font-medium">Live</span>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 rounded-lg" style={{ 
              backgroundColor: 'var(--bg-secondary)',
            }}>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-normal)' }}>
                {transcript || interimTranscript || (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {isAnswering ? 'Speak your answer...' : isSpeaking ? 'Listen to the question...' : 'Waiting to start recording...'}
                  </span>
                )}
                {interimTranscript && (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}> {interimTranscript}</span>
                )}
              </p>
            </div>
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

        {/* Controls - Below both panels */}
        <div className="flex flex-wrap gap-4 justify-center">
          {!isAnswering ? (
            <>
              {!isSpeaking && (
                <button
                  onClick={handleStartAnswering}
                  disabled={isSpeaking || isSubmitting}
                  className="px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  <Send className="w-5 h-5" />
                  {currentQuestionIndex >= totalQuestions - 1 ? 'Submit & Finish' : 'Submit & Continue'}
                </button>
              )}
              {isSubmitting && (
                <div className="text-center py-3" style={{ color: 'var(--text-normal)' }}>
                  <div className="inline-flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5" style={{ color: 'var(--accent)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving your answer...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleStopAnswering}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
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
