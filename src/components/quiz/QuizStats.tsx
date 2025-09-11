'use client';

import { Question } from '@/types';
import { useQuizStore } from '@/lib/store/quiz-store';

interface QuizStatsProps {
  questions: Question[];
}

export function QuizStats({ questions }: QuizStatsProps) {
  const { questionStates } = useQuizStore();

  const stats = questions.reduce((acc, question) => {
    const state = questionStates[question.id];
    
    if (state?.answered) {
      acc.answered++;
      if (state.correct) {
        acc.correct++;
      }
      acc.totalTime += state.timeSpent;
    }
    
    return acc;
  }, {
    answered: 0,
    correct: 0,
    totalTime: 0,
  });

  const accuracy = stats.answered > 0 ? (stats.correct / stats.answered) * 100 : 0;
  const averageTime = stats.answered > 0 ? stats.totalTime / stats.answered : 0;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="card p-4 space-y-4">
      <h3 className="font-medium text-secondary-900 dark:text-white">
        Session Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {stats.answered}
          </div>
          <div className="text-xs text-secondary-600 dark:text-secondary-400">
            Answered
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {accuracy.toFixed(0)}%
          </div>
          <div className="text-xs text-secondary-600 dark:text-secondary-400">
            Accuracy
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.correct}
          </div>
          <div className="text-xs text-secondary-600 dark:text-secondary-400">
            Correct
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatTime(averageTime)}
          </div>
          <div className="text-xs text-secondary-600 dark:text-secondary-400">
            Avg Time
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-secondary-600 dark:text-secondary-400 mb-1">
          <span>Progress</span>
          <span>{stats.answered}/{questions.length}</span>
        </div>
        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{
              width: `${(stats.answered / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Difficulty breakdown */}
      {stats.answered > 0 && (
        <div>
          <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            By Difficulty
          </h4>
          <div className="space-y-1">
            {['Easy', 'Medium', 'Hard'].map((difficulty) => {
              const difficultyQuestions = questions.filter(q => q.difficulty === difficulty);
              const answeredCount = difficultyQuestions.reduce((count, q) => {
                return count + (questionStates[q.id]?.answered ? 1 : 0);
              }, 0);
              const correctCount = difficultyQuestions.reduce((count, q) => {
                const state = questionStates[q.id];
                return count + (state?.answered && state.correct ? 1 : 0);
              }, 0);
              
              if (difficultyQuestions.length === 0) return null;
              
              return (
                <div key={difficulty} className="flex justify-between text-xs">
                  <span className="text-secondary-600 dark:text-secondary-400">
                    {difficulty}
                  </span>
                  <span className="text-secondary-700 dark:text-secondary-300">
                    {correctCount}/{answeredCount} ({difficultyQuestions.length} total)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
