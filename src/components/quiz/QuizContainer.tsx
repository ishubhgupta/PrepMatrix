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
  const { filters } = useUIStore();

  useEffect(() => {
    // Apply filters
    const filtered = getFilteredQuestions({
      subjects: filters.subjects.length > 0 ? filters.subjects : [subject.id],
      topics: filters.topics,
      difficulties: filters.difficulties,
    }).filter(q => q.subject === subject.id);
    
    setFilteredQuestions(filtered);
  }, [filters, questions, subject.id]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <QuizFilters 
        questions={questions} 
        subject={subject.id}
        onFiltersChange={() => {
          // Filter logic is handled by the store
        }}
      />

      {/* Stats */}
      <QuizStats 
        totalQuestions={filteredQuestions.length}
        subject={subject.id}
      />

      {/* Questions */}
      <div className="space-y-4">
        {filteredQuestions.map((question, index) => (
          <QuestionCard 
            key={question.id} 
            question={question}
            questionNumber={index + 1}
            totalQuestions={filteredQuestions.length}
          />
        ))}
      </div>

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
