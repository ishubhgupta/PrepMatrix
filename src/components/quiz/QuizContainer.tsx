'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/types';
import { QuestionCard } from './QuestionCard';
import { QuizFilters } from './QuizFilters';
import { QuizStats } from './QuizStats';
import { getFilteredQuestions } from '@/data';
import { useUIStore } from '@/lib/store/ui-store';

interface QuizContainerProps {
  questions: Question[];
  subject: {
    id: string;
    name: string;
    description: string;
    color: string;
    totalQuestions: number;
  };
}

export function QuizContainer({ questions, subject }: QuizContainerProps) {
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions);
  const [currentPage, setCurrentPage] = useState(0);
  const { filters, setFilters } = useUIStore();

  const questionsPerPage = 10;
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const currentQuestions = filteredQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  // Get available topics for this subject
  const availableTopics = [...new Set(questions.map(q => q.topic))].sort();

  useEffect(() => {
    // Apply filters
    const filtered = getFilteredQuestions({
      subjects: filters.subjects.length > 0 ? filters.subjects : [subject.id],
      topics: filters.topics,
      difficulties: filters.difficulties,
    }).filter(q => q.subject === subject.id);
    
    setFilteredQuestions(filtered);
    setCurrentPage(0);
  }, [filters, questions, subject.id]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <QuizFilters 
        filters={filters}
        onFiltersChange={setFilters}
        availableTopics={availableTopics}
      />

      {/* Stats */}
      <QuizStats 
        questions={filteredQuestions}
      />

      {/* Questions */}
      <div className="space-y-4">
        {currentQuestions.map((question, index) => (
          <QuestionCard 
            key={question.id} 
            question={question}
            questionNumber={currentPage * questionsPerPage + index + 1}
            totalQuestions={filteredQuestions.length}
            onNext={() => {
              const nextIndex = currentPage * questionsPerPage + index + 1;
              if (nextIndex < currentQuestions.length) {
                // Scroll to next question
              } else if (currentPage < totalPages - 1) {
                setCurrentPage(currentPage + 1);
              }
            }}
            onPrevious={() => {
              const prevIndex = currentPage * questionsPerPage + index - 1;
              if (prevIndex >= 0) {
                // Scroll to previous question  
              } else if (currentPage > 0) {
                setCurrentPage(currentPage - 1);
              }
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="btn btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="btn btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-500">No questions match your current filters.</p>
          <button 
            onClick={() => {
              // Reset filters
            }}
            className="btn btn-primary mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
