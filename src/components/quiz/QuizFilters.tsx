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
            <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              {filters.topics.length + filters.difficulties.length}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-sm transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
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
          <div className="absolute top-full left-0 mt-2 w-full sm:w-[500px] card p-6 z-20">
            <div className="space-y-6">
              {/* Topics Filter */}
              <div>
                <h4 className="text-xs font-medium tracking-wide uppercase mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicToggle(topic)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.topics.includes(topic)
                          ? 'shadow-md'
                          : 'hover:shadow-sm'
                      }`}
                      style={
                        filters.topics.includes(topic)
                          ? {
                              backgroundColor: 'var(--accent)',
                              color: 'white',
                            }
                          : {
                              backgroundColor: 'var(--accent-soft)',
                              color: 'var(--accent)',
                            }
                      }
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h4 className="text-xs font-medium tracking-wide uppercase mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Difficulty
                </h4>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => {
                    const isActive = filters.difficulties.includes(difficulty);
                    const colors = {
                      Easy: {
                        active: { bg: '#22c55e', color: 'white' },
                        inactive: { bg: 'rgba(34, 197, 94, 0.12)', color: '#16a34a' }
                      },
                      Medium: {
                        active: { bg: '#f59e0b', color: 'white' },
                        inactive: { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }
                      },
                      Hard: {
                        active: { bg: '#ef4444', color: 'white' },
                        inactive: { bg: 'rgba(239, 68, 68, 0.12)', color: '#dc2626' }
                      },
                    };

                    const style = isActive 
                      ? colors[difficulty as keyof typeof colors].active 
                      : colors[difficulty as keyof typeof colors].inactive;

                    return (
                      <button
                        key={difficulty}
                        onClick={() => handleDifficultyToggle(difficulty)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isActive ? 'shadow-md' : 'hover:shadow-sm'
                        }`}
                        style={{
                          backgroundColor: style.bg,
                          color: style.color,
                        }}
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
