'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/types';
import { useQuizStore } from '@/lib/store/quiz-store';
import { useChatStore } from '@/lib/store/chat-store';
import { CheckCircle, XCircle, Brain, Lightbulb, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AIResponseModal } from '@/components/ui/AIResponseModal';
import { AILoading } from '@/components/ui/AILoading';
import { AIQuestionCard } from '@/components/ui/AIQuestionCard';
import { AIChatModal } from '@/components/ui/AIChatModal';

interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState<'simple' | 'detailed' | 'advanced'>('simple');
  
  // AI Response Modal states
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalContent, setAIModalContent] = useState('');
  const [aiModalTitle, setAIModalTitle] = useState('');
  const [aiModalType, setAIModalType] = useState<'question' | 'explanation'>('explanation');
  
  // AI Interactive Question states
  const [showAIQuestion, setShowAIQuestion] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<GeneratedQuestion | null>(null);
  
  // AI Chat Modal state
  const [showChatModal, setShowChatModal] = useState(false);

  const { answerQuestion, getQuestionState } = useQuizStore();
  const { isGeminiEnabled } = useChatStore();
  const state = getQuestionState(question.id);

  // Get correct answer index
  const correctAnswerIndex = question.options.findIndex(option => option.correct);

  // Reset local state when store state changes (e.g., after reset)
  useEffect(() => {
    const currentState = getQuestionState(question.id);
    if (!currentState.answered) {
      // Question was reset, clear local state
      setSelectedOption(null);
      setShowAnswer(false);
    } else if (currentState.answered) {
      // Question has been answered, restore state
      setSelectedOption(currentState.selectedOption);
      setShowAnswer(true);
    }
  }, [state.answered, question.id, getQuestionState]);

  useEffect(() => {
    setMounted(true);
    
    // Restore previous state if exists
    const currentState = getQuestionState(question.id);
    if (currentState && currentState.answered) {
      setSelectedOption(currentState.selectedOption);
      setShowAnswer(true);
    }
  }, [question.id, getQuestionState]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (showAnswer) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null || showAnswer) return;
    
    setShowAnswer(true);
    answerQuestion(question.id, selectedOption, 0);
  };

  const getOptionColor = (optionIndex: number) => {
    if (!showAnswer) {
      return selectedOption === optionIndex ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500' : '';
    }
    
    if (optionIndex === correctAnswerIndex) {
      return 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200';
    }
    
    if (optionIndex === selectedOption && optionIndex !== correctAnswerIndex) {
      return 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200';
    }
    
    return 'opacity-50';
  };

  const generateSimilarQuestion = async () => {
    if (!isGeminiEnabled()) {
      setAIModalTitle('Configuration Required');
      setAIModalContent('AI features require configuration. Please check that NEXT_PUBLIC_GEMINI_API_KEY is set in your .env.local file.');
      setAIModalType('explanation');
      setShowAIModal(true);
      return;
    }

    setIsGeneratingSimilar(true);
    try {
      const response = await fetch('/api/ai/generate-similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question,
          subject: question.subject,
          topic: question.topic,
          difficulty: question.difficulty,
        }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // If it's a 503 error (service overloaded), provide a helpful fallback
        if (response.status === 503) {
          setAIModalTitle('Service Temporarily Unavailable');
          setAIModalContent('The AI service is currently experiencing high demand. This is normal and usually resolves within a few minutes. Please try again in a moment, or continue with your current questions.');
          setAIModalType('explanation');
          setShowAIModal(true);
          return;
        }
        
        // For other errors, try to get error message from response
        let errorMessage = 'Failed to generate similar question';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Parse JSON response with error handling
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response format from server. Please try again.');
      }

      if (data.success && data.generatedQuestion) {
        // Set the generated question data and show the interactive card
        setGeneratedQuestion(data.generatedQuestion);
        setShowAIQuestion(true);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error: any) {
      console.error('Error generating similar question:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to generate similar question. ';
      
      if (error.message?.includes('overloaded') || error.message?.includes('503')) {
        errorMessage = 'The AI service is currently busy. Please try again in a few moments.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        errorMessage += error.message;
      }
      
      setAIModalTitle('Error Generating Question');
      setAIModalContent(errorMessage);
      setAIModalType('explanation');
      setShowAIModal(true);
    } finally {
      setIsGeneratingSimilar(false);
    }
  };

  const explainLike = async (level: 'simple' | 'detailed' | 'advanced') => {
    if (!isGeminiEnabled()) {
      setAIModalTitle('Configuration Required');
      setAIModalContent('AI features require configuration. Please check that NEXT_PUBLIC_GEMINI_API_KEY is set in your .env.local file.');
      setAIModalType('explanation');
      setShowAIModal(true);
      return;
    }

    setIsExplaining(true);
    setExplanationLevel(level);
    
    try {
      const correctOption = question.options[correctAnswerIndex];
      
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question,
          correctAnswer: correctOption.text,
          rationale: question.rationale,
          level,
        }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = 'Failed to generate explanation';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Parse JSON response with error handling
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response format from server. Please try again.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate explanation');
      }

      if (data.success && data.explanation) {
        setAIModalTitle(`${level.charAt(0).toUpperCase() + level.slice(1)} AI Explanation`);
        setAIModalContent(data.explanation);
        setAIModalType('explanation');
        setShowAIModal(true);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error: any) {
      console.error('Error generating explanation:', error);
      setAIModalTitle('Error Generating Explanation');
      setAIModalContent(`Failed to generate explanation: ${error.message}`);
      setAIModalType('explanation');
      setShowAIModal(true);
    } finally {
      setIsExplaining(false);
    }
  };

  if (!mounted) {
    return <div className="card p-6">Loading...</div>;
  }

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              question.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
              question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
            }`}>
              {question.difficulty}
            </span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
              {question.topic}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
            {showAnswer && (
              <>
                {state?.correct ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={state?.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {state?.correct ? 'Correct!' : 'Incorrect'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Question */}
      <div>
        <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showAnswer}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                getOptionColor(index)
              } ${
                !showAnswer && !getOptionColor(index) 
                  ? 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600' 
                  : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="font-medium text-secondary-700 dark:text-secondary-300 mt-0.5">
                  {letter})
                </span>
                <span className="flex-1">
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      {!showAnswer && (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      )}

      {/* Explanation */}
      {showAnswer && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Explanation
            </h4>
            <div className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed prose prose-sm prose-blue max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
              <ReactMarkdown>{question.rationale}</ReactMarkdown>
            </div>
          </div>

          {/* AI Features */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={generateSimilarQuestion}
              disabled={isGeneratingSimilar || !isGeminiEnabled()}
              className="btn btn-secondary text-xs flex items-center space-x-1 disabled:opacity-50"
            >
              <Brain className="h-3 w-3" />
              <span>{isGeneratingSimilar ? 'Generating...' : 'Similar Question'}</span>
            </button>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => explainLike('simple')}
                disabled={isExplaining || !isGeminiEnabled()}
                className="btn btn-secondary text-xs flex items-center space-x-1 disabled:opacity-50"
              >
                <Lightbulb className="h-3 w-3" />
                <span>{isExplaining && explanationLevel === 'simple' ? 'Explaining...' : 'Explain Simply'}</span>
              </button>
              
              <button
                onClick={() => explainLike('detailed')}
                disabled={isExplaining || !isGeminiEnabled()}
                className="btn btn-secondary text-xs flex items-center space-x-1 disabled:opacity-50"
              >
                <Lightbulb className="h-3 w-3" />
                <span>{isExplaining && explanationLevel === 'detailed' ? 'Explaining...' : 'Detailed'}</span>
              </button>
              
              <button
                onClick={() => explainLike('advanced')}
                disabled={isExplaining || !isGeminiEnabled()}
                className="btn btn-secondary text-xs flex items-center space-x-1 disabled:opacity-50"
              >
                <Lightbulb className="h-3 w-3" />
                <span>{isExplaining && explanationLevel === 'advanced' ? 'Explaining...' : 'Advanced'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (!isGeminiEnabled()) {
                  setAIModalTitle('Configuration Required');
                  setAIModalContent('AI features require configuration. Please check that NEXT_PUBLIC_GEMINI_API_KEY is set in your .env.local file.');
                  setAIModalType('explanation');
                  setShowAIModal(true);
                  return;
                }
                setShowChatModal(true);
              }}
              disabled={!isGeminiEnabled()}
              className="btn btn-secondary text-xs flex items-center space-x-1 disabled:opacity-50"
            >
              <MessageCircle className="h-3 w-3" />
              <span>Discuss</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Loading Overlay */}
      <AILoading 
        isVisible={isGeneratingSimilar || isExplaining}
        message={
          isGeneratingSimilar 
            ? 'Generating a similar question...' 
            : isExplaining 
              ? `Creating ${explanationLevel} explanation...`
              : ''
        }
      />

      {/* AI Response Modal */}
      <AIResponseModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title={aiModalTitle}
        content={aiModalContent}
        type={aiModalType}
      />

      {/* AI Interactive Question Card */}
      {showAIQuestion && generatedQuestion && (
        <AIQuestionCard
          generatedQuestion={generatedQuestion}
          onClose={() => {
            setShowAIQuestion(false);
            setGeneratedQuestion(null);
          }}
          originalSubject={question.subject}
          originalTopic={question.topic}
          originalDifficulty={question.difficulty}
          onGenerateAnother={() => {
            // Close current and regenerate
            setShowAIQuestion(false);
            generateSimilarQuestion();
          }}
          onExplainDifferently={(explanation) => {
            // Show the alternative explanation in a modal
            setAIModalTitle('Alternative Explanation');
            setAIModalContent(explanation);
            setAIModalType('explanation');
            setShowAIModal(true);
          }}
        />
      )}

      {/* AI Chat Modal */}
      <AIChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        questionContext={{
          question: question.question,
          correctAnswer: question.options[correctAnswerIndex].text,
          rationale: question.rationale,
        }}
      />
    </div>
  );
}
