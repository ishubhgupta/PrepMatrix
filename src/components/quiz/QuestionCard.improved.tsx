'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Question } from '@/types';
import { useQuizStore } from '@/lib/store/quiz-store';
import { useChatStore } from '@/lib/store/chat-store';
import { CheckCircle2, XCircle, Brain, Lightbulb, MessageCircle, ChevronDown } from 'lucide-react';
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
  onAnswerCorrect?: () => void;
}

export function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions,
  onAnswerCorrect
}: QuestionCardProps) {
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState<'simple' | 'detailed' | 'advanced'>('simple');
  const [startTime] = useState(Date.now());
  
  // Hint system
  const [hintsUsed, setHintsUsed] = useState<number[]>([]);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [conceptualHint, setConceptualHint] = useState<string>('');
  const [explanationSnippet, setExplanationSnippet] = useState<string>('');
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const nextQuestionRef = useRef<HTMLDivElement>(null);
  
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

  // Reset local state when store state changes
  useEffect(() => {
    const currentState = getQuestionState(question.id);
    if (!currentState.answered) {
      setSelectedOption(null);
      setShowAnswer(false);
      setShowFeedback(false);
    } else if (currentState.answered) {
      setSelectedOption(currentState.selectedOption);
      setShowAnswer(true);
      setShowFeedback(true);
    }
  }, [state.answered, question.id, getQuestionState]);

  useEffect(() => {
    setMounted(true);
    
    // Restore previous state if exists
    const currentState = getQuestionState(question.id);
    if (currentState && currentState.answered) {
      setSelectedOption(currentState.selectedOption);
      setShowAnswer(true);
      setShowFeedback(true);
    }
  }, [question.id, getQuestionState]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (showAnswer) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = async () => {
    if (selectedOption === null || showAnswer) return;
    
    const isCorrect = selectedOption === correctAnswerIndex;
    const timeSpent = Date.now() - startTime;
    
    setShowAnswer(true);
    setShowFeedback(true);
    answerQuestion(question.id, selectedOption, timeSpent);
    
    // Save to database if user is authenticated
    if (session?.user) {
      try {
        await fetch('/api/questions/attempt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: question.id,
            selectedAnswer: ['A', 'B', 'C', 'D'][selectedOption],
            isCorrect,
            timeSpent,
          }),
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
    
    // If correct, smooth scroll to next question after a delay
    if (isCorrect) {
      setTimeout(() => {
        onAnswerCorrect?.();
        // Scroll to next question smoothly
        if (nextQuestionRef.current) {
          nextQuestionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 1500);
    }
  };

  const getOptionIcon = (optionIndex: number) => {
    if (!showAnswer) return null;
    
    if (optionIndex === correctAnswerIndex) {
      return <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2.5} />;
    }
    
    if (optionIndex === selectedOption && optionIndex !== correctAnswerIndex) {
      return <XCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />;
    }
    
    return null;
  };

  // Hint System Functions
  const handleUseHint = (tier: number) => {
    if (hintsUsed.includes(tier) || showAnswer) return;
    
    setHintsUsed([...hintsUsed, tier]);
    setScoreMultiplier(prev => Math.max(prev - 0.1, 0.7)); // -10% per hint, min 70%

    if (tier === 1) {
      // Eliminate 2 wrong options
      const wrongIndices = question.options
        .map((opt, idx) => idx)
        .filter(idx => idx !== correctAnswerIndex);
      const toEliminate = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
      setEliminatedOptions(toEliminate);
    } else if (tier === 2) {
      // Generate conceptual hint
      const hints = [
        `Think about the core concept of ${question.topic}`,
        `Consider how this relates to ${question.subject} fundamentals`,
        `Focus on the key difference between the options`,
        `Remember the definition and common use cases`,
      ];
      setConceptualHint(hints[Math.floor(Math.random() * hints.length)]);
    } else if (tier === 3) {
      // Show explanation snippet (first 100 characters)
      setExplanationSnippet(question.rationale.substring(0, 100) + '...');
    }
  };

  const getOptionStyle = (optionIndex: number) => {
    // Eliminated options
    if (eliminatedOptions.includes(optionIndex) && !showAnswer) {
      return 'border-black/5 opacity-30 cursor-not-allowed bg-black/5';
    }
    
    if (!showAnswer) {
      if (selectedOption === optionIndex) {
        return 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] scale-[1.01] shadow-md';
      }
      return 'border-black/10 hover:border-[color:var(--accent)] hover:bg-black/5 cursor-pointer';
    }
    
    if (optionIndex === correctAnswerIndex) {
      return 'border-green-500 bg-green-50 scale-[1.01] shadow-md';
    }
    
    if (optionIndex === selectedOption && optionIndex !== correctAnswerIndex) {
      return 'border-red-500 bg-red-50 scale-[0.99]';
    }
    
    return 'border-black/5 opacity-40';
  };

  const generateSimilarQuestion = async () => {
    if (!isGeminiEnabled()) {
      setAIModalTitle('Configuration Required');
      setAIModalContent('AI features require configuration. Please check that GEMINI_API_KEY is set in your .env.local file.');
      setAIModalType('explanation');
      setShowAIModal(true);
      return;
    }

    setIsGeneratingSimilar(true);
    try {
      const response = await fetch('/api/ai/generate-similar/', {
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

      if (!response.ok) {
        if (response.status === 503) {
          setAIModalTitle('Service Temporarily Unavailable');
          setAIModalContent('The AI service is currently experiencing high demand. Please try again in a moment.');
          setAIModalType('explanation');
          setShowAIModal(true);
          return;
        }
        
        let errorMessage = 'Failed to generate similar question';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.success && data.generatedQuestion) {
        setGeneratedQuestion(data.generatedQuestion);
        setShowAIQuestion(true);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error: any) {
      console.error('Error generating similar question:', error);
      setAIModalTitle('Error');
      setAIModalContent(`Failed to generate question: ${error.message}`);
      setAIModalType('explanation');
      setShowAIModal(true);
    } finally {
      setIsGeneratingSimilar(false);
    }
  };

  const explainLike = async (level: 'simple' | 'detailed' | 'advanced') => {
    if (!isGeminiEnabled()) {
      setAIModalTitle('Configuration Required');
      setAIModalContent('AI features require configuration. Please check that GEMINI_API_KEY is set in your .env.local file.');
      setAIModalType('explanation');
      setShowAIModal(true);
      return;
    }

    setIsExplaining(true);
    setExplanationLevel(level);
    
    try {
      const correctOption = question.options[correctAnswerIndex];
      
      const response = await fetch('/api/ai/explain/', {
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

      const data = await response.json();

      if (data.success && data.explanation) {
        setAIModalTitle(`${level.charAt(0).toUpperCase() + level.slice(1)} Explanation`);
        setAIModalContent(data.explanation);
        setAIModalType('explanation');
        setShowAIModal(true);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error: any) {
      console.error('Error generating explanation:', error);
      setAIModalTitle('Error');
      setAIModalContent(`Failed to generate explanation: ${error.message}`);
      setAIModalType('explanation');
      setShowAIModal(true);
    } finally {
      setIsExplaining(false);
    }
  };

  if (!mounted) {
    return <div className="card p-8"><div className="h-64 animate-pulse bg-black/5 rounded-lg"></div></div>;
  }

  const isCorrectAnswer = showAnswer && selectedOption === correctAnswerIndex;
  const isWrongAnswer = showAnswer && selectedOption !== correctAnswerIndex;

  return (
    <>
      <div ref={cardRef} className="card p-6 md:p-8 transition-all duration-300" id={`question-${question.id}`}>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              {Math.round((questionNumber / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(questionNumber / totalQuestions) * 100}%`,
                background: 'var(--accent)'
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
            question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {question.difficulty}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
            {question.topic}
          </span>
          
          {showFeedback && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              isCorrectAnswer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isCorrectAnswer ? (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Correct!</>
              ) : (
                <><XCircle className="w-3.5 h-3.5" /> Incorrect</>
              )}
            </span>
          )}
        </div>

        {/* Question */}
        <h3 className="text-xl md:text-2xl font-semibold mb-8 leading-relaxed" style={{ color: 'var(--text-strong)' }}>
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            // Hide eliminated options
            if (eliminatedOptions.includes(index) && !showAnswer) return null;
            
            const letter = String.fromCharCode(65 + index);
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showAnswer || eliminatedOptions.includes(index)}
                className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 ${
                  getOptionStyle(index)
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm"
                    style={{ 
                      background: showAnswer && index === correctAnswerIndex ? '#22c55e' :
                                 showAnswer && index === selectedOption && index !== correctAnswerIndex ? '#ef4444' :
                                 selectedOption === index && !showAnswer ? 'var(--accent)' : 'rgba(0,0,0,0.06)',
                      color: (showAnswer && (index === correctAnswerIndex || (index === selectedOption && index !== correctAnswerIndex))) ||
                             (selectedOption === index && !showAnswer) ? '#fff' : 'var(--text-strong)'
                    }}>
                    {letter}
                  </div>
                  <span className="flex-1 text-base" style={{ color: 'var(--text-strong)' }}>
                    {option.text}
                  </span>
                  {getOptionIcon(index)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint System */}
        {!showAnswer && (
          <div className="mb-6 space-y-3">
            {/* Hint Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleUseHint(1)}
                disabled={hintsUsed.includes(1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  hintsUsed.includes(1)
                    ? 'bg-black/5 text-black/30 cursor-not-allowed'
                    : 'bg-white border-2 border-black/10 hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] text-[color:var(--text-strong)]'
                }`}
              >
                Eliminate 2 Options
              </button>
              <button
                type="button"
                onClick={() => handleUseHint(2)}
                disabled={hintsUsed.includes(2)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  hintsUsed.includes(2)
                    ? 'bg-black/5 text-black/30 cursor-not-allowed'
                    : 'bg-white border-2 border-black/10 hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] text-[color:var(--text-strong)]'
                }`}
              >
                Get Hint
              </button>
              <button
                type="button"
                onClick={() => handleUseHint(3)}
                disabled={hintsUsed.includes(3)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  hintsUsed.includes(3)
                    ? 'bg-black/5 text-black/30 cursor-not-allowed'
                    : 'bg-white border-2 border-black/10 hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] text-[color:var(--text-strong)]'
                }`}
              >
                Show Explanation
              </button>
            </div>

            {/* Active Hints Display */}
            {conceptualHint && (
              <div className="p-4 rounded-lg border-2 border-[color:var(--accent)] bg-[color:var(--accent-soft)]">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-strong)' }}>Hint:</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{conceptualHint}</p>
                  </div>
                </div>
              </div>
            )}
            {explanationSnippet && (
              <div className="p-4 rounded-lg border-2 border-[color:var(--accent)] bg-[color:var(--accent-soft)]">
                <div className="flex items-start gap-2">
                  <span className="text-lg">📖</span>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-strong)' }}>Partial Explanation:</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{explanationSnippet}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        {!showAnswer && (
          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="btn btn-primary w-full py-4 text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {selectedOption !== null ? 'Submit Answer' : 'Select an answer to continue'}
            </button>
          </div>
        )}

        {/* Explanation */}
        {showAnswer && (
          <div className="space-y-4 mt-6">
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
                <Lightbulb className="w-5 h-5" style={{ color: '#3b82f6' }} />
                Explanation
              </h4>
              <div className="text-sm leading-relaxed prose prose-sm max-w-none" style={{ color: 'var(--text-muted)' }}>
                <ReactMarkdown>{question.rationale}</ReactMarkdown>
              </div>
            </div>

            {/* AI Features */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={generateSimilarQuestion}
                disabled={isGeneratingSimilar || !isGeminiEnabled()}
                className="btn btn-ghost text-sm flex items-center gap-2 disabled:opacity-40"
              >
                <Brain className="w-4 h-4" />
                {isGeneratingSimilar ? 'Generating...' : 'Similar Question'}
              </button>
              
              <button
                onClick={() => explainLike('simple')}
                disabled={isExplaining || !isGeminiEnabled()}
                className="btn btn-ghost text-sm flex items-center gap-2 disabled:opacity-40"
              >
                <Lightbulb className="w-4 h-4" />
                {isExplaining && explanationLevel === 'simple' ? 'Explaining...' : 'Explain Simply'}
              </button>
              
              <button
                onClick={() => explainLike('detailed')}
                disabled={isExplaining || !isGeminiEnabled()}
                className="btn btn-ghost text-sm flex items-center gap-2 disabled:opacity-40"
              >
                <Lightbulb className="w-4 h-4" />
                {isExplaining && explanationLevel === 'detailed' ? 'Explaining...' : 'Detailed'}
              </button>

              <button
                onClick={() => {
                  if (!isGeminiEnabled()) {
                    setAIModalTitle('Configuration Required');
                    setAIModalContent('AI features require configuration. Please check that GEMINI_API_KEY is set in your .env.local file.');
                    setAIModalType('explanation');
                    setShowAIModal(true);
                    return;
                  }
                  setShowChatModal(true);
                }}
                disabled={!isGeminiEnabled()}
                className="btn btn-ghost text-sm flex items-center gap-2 disabled:opacity-40"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with AI
              </button>
            </div>

            {/* Next Question Indicator */}
            {isCorrectAnswer && questionNumber < totalQuestions && (
              <div className="flex items-center justify-center gap-2 pt-4 text-sm animate-bounce" style={{ color: 'var(--text-muted)' }}>
                <span>Scrolling to next question</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            )}
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
              setShowAIQuestion(false);
              generateSimilarQuestion();
            }}
            onExplainDifferently={(explanation) => {
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
      
      {/* Scroll Target for next question */}
      <div ref={nextQuestionRef} className="h-1" />
    </>
  );
}
