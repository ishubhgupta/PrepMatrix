'use client';

import { useState } from 'react';
import { X, Sparkles, Loader2, Plus, Trash2 } from 'lucide-react';

interface CustomPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    topic: string;
    timeframe: number;
    depth: 'beginner' | 'intermediate' | 'advanced';
    specificGoals: string[];
  }) => void;
  isGenerating: boolean;
}

export function CustomPlanModal({ isOpen, onClose, onGenerate, isGenerating }: CustomPlanModalProps) {
  const [topic, setTopic] = useState('');
  const [timeframe, setTimeframe] = useState(7);
  const [depth, setDepth] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [goals, setGoals] = useState<string[]>(['']);

  const handleAddGoal = () => {
    setGoals([...goals, '']);
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredGoals = goals.filter(g => g.trim() !== '');
    onGenerate({ topic, timeframe, depth, specificGoals: filteredGoals });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[color:var(--bg-bone)] border-b border-black/5 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>
              Create Custom Study Plan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors"
            disabled={isGenerating}
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
              What do you want to learn? *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., React Hooks, Machine Learning Algorithms, Docker & Kubernetes"
              className="w-full px-4 py-3 rounded-lg border border-black/10 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 outline-none transition-all"
              style={{ background: 'var(--bg-bone)', color: 'var(--text-strong)' }}
              required
              disabled={isGenerating}
            />
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
              Timeframe: {timeframe} days
            </label>
            <input
              type="range"
              min="3"
              max="30"
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((timeframe - 3) / 27) * 100}%, rgba(0,0,0,0.1) ${((timeframe - 3) / 27) * 100}%, rgba(0,0,0,0.1) 100%)`,
              }}
              disabled={isGenerating}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              <span>3 days</span>
              <span>30 days</span>
            </div>
          </div>

          {/* Depth Level */}
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-strong)' }}>
              Depth Level *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDepth(level)}
                  disabled={isGenerating}
                  className={`px-4 py-3 rounded-lg font-medium transition-all capitalize ${
                    depth === level
                      ? 'bg-[color:var(--accent)] text-white shadow-md'
                      : 'bg-black/5 hover:bg-black/10'
                  }`}
                  style={depth !== level ? { color: 'var(--text-muted)' } : {}}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              {depth === 'beginner' && 'Start from basics with foundational concepts'}
              {depth === 'intermediate' && 'Assume basic knowledge, focus on practical applications'}
              {depth === 'advanced' && 'Deep dive into complex scenarios and best practices'}
            </p>
          </div>

          {/* Specific Goals */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
              Specific Goals (Optional)
            </label>
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    placeholder={`Goal ${index + 1} (e.g., Build a real-world project)`}
                    className="flex-1 px-4 py-2 rounded-lg border border-black/10 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 outline-none transition-all"
                    style={{ background: 'var(--bg-bone)', color: 'var(--text-strong)' }}
                    disabled={isGenerating}
                  />
                  {goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(index)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      disabled={isGenerating}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {goals.length < 5 && (
              <button
                type="button"
                onClick={handleAddGoal}
                className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors text-sm font-medium"
                style={{ color: 'var(--accent)' }}
                disabled={isGenerating}
              >
                <Plus className="w-4 h-4" />
                Add Another Goal
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-black/10 hover:bg-black/5 transition-colors font-medium"
              style={{ color: 'var(--text-muted)' }}
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!topic || isGenerating}
              className="flex-1 btn-primary px-6 py-3 inline-flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
