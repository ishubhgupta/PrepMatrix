'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/types';
import { useUIStore } from '@/lib/store/ui-store';
import { Filter, X, ChevronDown } from 'lucide-react';

interface QuizFiltersProps {
  questions: Question[];
  subject: string;
  onFiltersChange?: (filters: any) => void;
}

export function QuizFilters({ questions, subject, onFiltersChange }: QuizFiltersProps) {
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { filters, setFilters, resetFilters } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract unique topics from questions
  const topics = Array.from(new Set(questions.map(q => q.topic)));
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleTopicToggle = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic];
    
    setFilters({ topics: newTopics });
    onFiltersChange?.({ ...filters, topics: newTopics });
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...filters.difficulties, difficulty];
    
    setFilters({ difficulties: newDifficulties });
    onFiltersChange?.({ ...filters, difficulties: newDifficulties });
  };

  const handleReset = () => {
    resetFilters();
    onFiltersChange?.({ subjects: [], topics: [], difficulties: [] });
  };

  const hasActiveFilters = filters.topics.length > 0 || filters.difficulties.length > 0;

  if (!mounted) {
    return (
      <div className="mb-6">
        <button className="btn btn-secondary">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 relative">
      {/* Filter Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-medium rounded-full">
              {filters.topics.length + filters.difficulties.length}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Dropdown Panel */}
      {showFilters && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-10 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Filter Panel */}
          <div className="absolute top-full left-0 mt-2 w-full sm:w-[500px] bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 p-6 z-20">
            <div className="space-y-6">
              {/* Topics Filter */}
              <div>
                <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicToggle(topic)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        filters.topics.includes(topic)
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  Difficulty
                </h4>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => {
                    const colors = {
                      Easy: filters.difficulties.includes(difficulty)
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50',
                      Medium: filters.difficulties.includes(difficulty)
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
                      Hard: filters.difficulties.includes(difficulty)
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50',
                    };

                    return (
                      <button
                        key={difficulty}
                        onClick={() => handleDifficultyToggle(difficulty)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm ${
                          colors[difficulty as keyof typeof colors]
                        }`}
                      >
                        {difficulty}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
