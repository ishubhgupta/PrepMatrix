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
        <div className="relative w-full max-w-3xl bg-white dark:bg-secondary-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                  AI Generated Question
                </span>
              </div>
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded text-xs font-medium">
                Similar to {originalSubject} - {originalTopic}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
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
                  originalDifficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                  originalDifficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                }`}>
                  {originalDifficulty}
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
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
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                {generatedQuestion.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {generatedQuestion.options.map((option, index) => {
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
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    AI Explanation
                  </h4>
                  <div className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed prose prose-sm prose-blue max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                    <ReactMarkdown>{generatedQuestion.explanation}</ReactMarkdown>
                  </div>
                </div>

                {/* AI Features for Generated Question */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={async () => {
                      setIsGenerating(true);
                      try {
                        const response = await fetch('/api/ai/generate-similar', {
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
                        const response = await fetch('/api/ai/explain', {
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
          <div className="flex justify-between items-center p-6 border-t border-secondary-200 dark:border-secondary-700">
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
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
