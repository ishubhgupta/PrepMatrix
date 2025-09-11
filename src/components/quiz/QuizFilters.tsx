'use client';

import { useState } from 'react';
import { QuizFilters as QuizFiltersType } from '@/types';

interface QuizFiltersProps {
  filters: QuizFiltersType;
  onFiltersChange: (filters: QuizFiltersType) => void;
  availableTopics: string[];
}

export function QuizFilters({ filters, onFiltersChange, availableTopics }: QuizFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const newSubjects = checked
      ? [...filters.subjects, subject]
      : filters.subjects.filter(s => s !== subject);
    
    onFiltersChange({ ...filters, subjects: newSubjects });
  };

  const handleTopicChange = (topic: string, checked: boolean) => {
    const newTopics = checked
      ? [...filters.topics, topic]
      : filters.topics.filter(t => t !== topic);
    
    onFiltersChange({ ...filters, topics: newTopics });
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const newDifficulties = checked
      ? [...filters.difficulties, difficulty]
      : filters.difficulties.filter(d => d !== difficulty);
    
    onFiltersChange({ ...filters, difficulties: newDifficulties });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      subjects: [],
      topics: [],
      difficulties: [],
    });
  };

  const hasActiveFilters = filters.subjects.length > 0 || filters.topics.length > 0 || filters.difficulties.length > 0;

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-secondary-900 dark:text-white">
          Filters
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-secondary-500 dark:text-secondary-400"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Difficulty Filter */}
          <div>
            <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Difficulty
            </h4>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <label key={difficulty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.difficulties.includes(difficulty)}
                    onChange={(e) => handleDifficultyChange(difficulty, e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {difficulty}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Topics Filter */}
          {availableTopics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Topics
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableTopics.map((topic) => (
                  <label key={topic} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.topics.includes(topic)}
                      onChange={(e) => handleTopicChange(topic, e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {topic}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="pt-2 border-t">
          <div className="flex flex-wrap gap-1">
            {filters.difficulties.map((difficulty) => (
              <span
                key={difficulty}
                className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded text-xs"
              >
                {difficulty}
              </span>
            ))}
            {filters.topics.map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
