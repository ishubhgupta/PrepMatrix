'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Brain, Lightbulb, MessageCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AIChatModal } from './AIChatModal';

interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface AIQuestionCardProps {
  generatedQuestion: GeneratedQuestion;
  onClose: () => void;
  originalSubject: string;
  originalTopic: string;
  originalDifficulty: string;
  onGenerateAnother?: () => void;
  onExplainDifferently?: (explanation: string) => void;
}

export function AIQuestionCard({ 
  generatedQuestion, 
  onClose, 
  originalSubject, 
  originalTopic, 
  originalDifficulty,
  onGenerateAnother,
  onExplainDifferently
}: AIQuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [alternativeExplanation, setAlternativeExplanation] = useState<string>('');
  const [showChatModal, setShowChatModal] = useState(false);

  // Parse correct answer (A, B, C, or D) to index
  const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(generatedQuestion.correctAnswer.toUpperCase());

  const handleAnswerSelect = (optionIndex: number) => {
    if (showAnswer) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null || showAnswer) return;
    setShowAnswer(true);
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

  const isCorrect = selectedOption === correctAnswerIndex;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-lg shadow-xl" style={{ backgroundColor: 'var(--bg-card)' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                <span className="text-lg font-semibold" style={{ color: 'var(--text-strong)' }}>
                  AI Generated Question
                </span>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                Similar to {originalSubject} - {originalTopic}
              </span>
            </div>
            <button
              onClick={onClose}
              className="transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Question Content */}
          <div className="p-6 space-y-6">
            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  originalDifficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-200/30 dark:text-green-900' :
                  originalDifficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200/30 dark:text-yellow-700' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                }`}>
                  {originalDifficulty}
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-900 rounded text-xs font-medium">
                  {originalTopic}
                </span>
              </div>
              {showAnswer && (
                <div className="flex items-center space-x-2 text-sm">
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
              )}
            </div>

            {/* Question */}
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-strong)' }}>
                {generatedQuestion.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {generatedQuestion.options.map((option, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D
                const isCorrectOption = index === correctAnswerIndex;
                const isSelected = selectedOption === index;
                const isWrongSelection = showAnswer && isSelected && !isCorrectOption;
                
                let buttonStyle = {};
                if (!showAnswer) {
                  buttonStyle = isSelected 
                    ? { backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                    : { borderColor: 'rgba(0,0,0,0.1)' };
                } else {
                  if (isCorrectOption) {
                    buttonStyle = { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e', color: '#16a34a' };
                  } else if (isWrongSelection) {
                    buttonStyle = { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444', color: '#dc2626' };
                  } else {
                    buttonStyle = { opacity: 0.5, borderColor: 'rgba(0,0,0,0.1)' };
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showAnswer}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      !showAnswer && !isSelected ? 'hover:border-gray-300' : ''
                    }`}
                    style={buttonStyle}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="font-medium mt-0.5" style={{ color: 'var(--text-strong)' }}>
                        {letter})
                      </span>
                      <span className="flex-1">
                        {option}
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
                <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-900 mb-3 flex items-center gap-2 text-base">
                    <Lightbulb className="w-5 h-5" />
                    AI Explanation
                  </h4>
                  <div className="text-sm text-blue-900 dark:text-blue-900 leading-loose whitespace-pre-wrap">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-3 last:mb-0 text-sm leading-loose">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-outside ml-5 space-y-2 my-3">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-outside ml-5 space-y-2 my-3">{children}</ol>,
                        li: ({ children }) => <li className="text-sm leading-loose">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-blue-950 dark:text-blue-50">{children}</strong>,
                        code: ({ children }) => <code className="text-sm font-mono bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">{children}</code>,
                        h1: ({ children }) => <h1 className="text-base font-bold mb-2 mt-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-2">{children}</h3>,
                      }}
                    >
                      {generatedQuestion.explanation}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* AI Features for Generated Question */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={async () => {
                      setIsGenerating(true);
                      try {
                        const response = await fetch('/api/ai/generate-similar/', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            question: generatedQuestion.question,
                            subject: originalSubject,
                            topic: originalTopic,
                            difficulty: originalDifficulty,
                          }),
                        });
                        
                        if (response.ok && onGenerateAnother) {
                          onGenerateAnother();
                        } else {
                          alert('Failed to generate another question. Please try again.');
                        }
                      } catch (error) {
                        alert('Error generating question. Please try again.');
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                    disabled={isGenerating}
                    className="btn btn-secondary text-xs flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Brain className="h-3 w-3" />
                    <span>{isGenerating ? 'Generating...' : 'Another Similar'}</span>
                  </button>
                  
                  <button
                    onClick={async () => {
                      setIsExplaining(true);
                      try {
                        const response = await fetch('/api/ai/explain/', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            question: generatedQuestion.question,
                            correctAnswer: generatedQuestion.options[correctAnswerIndex],
                            rationale: generatedQuestion.explanation,
                            level: 'detailed',
                          }),
                        });
                        
                        if (response.ok) {
                          const data = await response.json();
                          setAlternativeExplanation(data.explanation);
                          if (onExplainDifferently) {
                            onExplainDifferently(data.explanation);
                          }
                        } else {
                          alert('Failed to generate alternative explanation. Please try again.');
                        }
                      } catch (error) {
                        alert('Error generating explanation. Please try again.');
                      } finally {
                        setIsExplaining(false);
                      }
                    }}
                    disabled={isExplaining}
                    className="btn btn-secondary text-xs flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Lightbulb className="h-3 w-3" />
                    <span>{isExplaining ? 'Explaining...' : 'Explain Differently'}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowChatModal(true)}
                    className="btn btn-secondary text-xs flex items-center space-x-1"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>Ask AI</span>
                  </button>
                </div>
                
                {/* Alternative Explanation */}
                {alternativeExplanation && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mt-4">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                      Alternative Explanation
                    </h4>
                    <div className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed prose prose-sm prose-purple max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                      <ReactMarkdown>{alternativeExplanation}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              💡 This question was generated by AI based on the concepts from your original question
            </div>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      <AIChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        questionContext={{
          question: generatedQuestion.question,
          correctAnswer: generatedQuestion.options[correctAnswerIndex],
          rationale: generatedQuestion.explanation,
        }}
      />
    </div>
  );
}
