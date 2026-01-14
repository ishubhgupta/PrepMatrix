'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';
import { CustomPlanModal } from '@/components/study-coach/CustomPlanModal';
import { StudyCoachChatbot } from '@/components/study-coach/StudyCoachChatbot';
import { AdaptiveChatbot } from '@/components/study-coach/AdaptiveChatbot';
import { Sparkles, Clock, Target, TrendingUp, CheckCircle2, Circle, Loader2, BarChart3, Brain, BookOpen, History } from 'lucide-react';
import { useStudyCoachStore } from '@/lib/store/study-coach-store';

interface StudyTask {
  id: string;
  title: string;
  description: string;
  taskType: 'learn' | 'practice' | 'review';
  subject: string;
  topic: string;
  targetCount: number;
  currentProgress: number;
  isCompleted: boolean;
  completedAt: string | null;
  orderIndex: number;
  estimatedMinutes: number;
}

interface StudyPlan {
  id: string;
  planType: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  focusAreas: string;
  goals: string;
  aiInsights: string;
  customPrompt?: string;
  completedTaskCount: number;
  totalTaskCount: number;
  tasks: StudyTask[];
  createdAt: string;
}

export default function StudyCoachPage() {
  const { data: session } = useSession();
  const { plan, setPlan, shouldRefetch } = useStudyCoachStore();
  const [allPlans, setAllPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatbotTopic, setChatbotTopic] = useState<string>('');
  const [chatbotContext, setChatbotContext] = useState<string>('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/study-coach/plan');
      const data = await response.json();
      setPlan(data.activePlan);
      setAllPlans(data.allPlans || []);
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError('Failed to load study plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user && shouldRefetch()) {
      fetchPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const generateNewPlan = async () => {
    try {
      setGenerating(true);
      setError(null);
      const response = await fetch('/api/study-coach/generate', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }
      
      const data = await response.json();
      setPlan(data.plan);
      fetchPlan(); // Refresh all plans
    } catch (err) {
      console.error('Error generating plan:', err);
      setError('Failed to generate study plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generateCustomPlan = async (data: {
    topic: string;
    timeframe: number;
    depth: 'beginner' | 'intermediate' | 'advanced';
    specificGoals: string[];
  }) => {
    try {
      setGenerating(true);
      setError(null);
      const response = await fetch('/api/study-coach/generate-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate custom plan');
      }
      
      const result = await response.json();
      setPlan(result.plan);
      setShowCustomModal(false);
      fetchPlan(); // Refresh all plans
    } catch (err) {
      console.error('Error generating custom plan:', err);
      setError('Failed to generate custom plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const activatePlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/study-coach/activate/${planId}`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlan(data.plan);
        fetchPlan(); // Refresh all plans
      }
    } catch (err) {
      console.error('Error activating plan:', err);
    }
  };

  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/study-coach/plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          isCompleted: !currentStatus,
        }),
      });

      if (response.ok) {
        // Refresh plan
        fetchPlan();
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-bone)' }}>
        <Header />
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p style={{ color: 'var(--text-muted)' }}>Please sign in to access your study coach</p>
          </div>
        </main>
      </div>
    );
  }

  const focusAreas = plan ? JSON.parse(plan.focusAreas) : [];
  const goals = plan ? JSON.parse(plan.goals) : [];
  const progress = plan ? Math.round((plan.completedTaskCount / plan.totalTaskCount) * 100) : 0;
  
  // Get selected plan details
  const displayPlan = selectedPlanId 
    ? allPlans.find(p => p.id === selectedPlanId) 
    : null;
  const displayFocusAreas = displayPlan ? JSON.parse(displayPlan.focusAreas) : [];
  const displayGoals = displayPlan ? JSON.parse(displayPlan.goals) : [];
  const displayProgress = displayPlan ? Math.round((displayPlan.completedTaskCount / displayPlan.totalTaskCount) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-bone)' }}>
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: 'var(--accent)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading your study plans...</p>
          </div>
        ) : selectedPlanId && displayPlan ? (
          // Show selected plan details
          <div>
            {/* Back Button */}
            <button
              onClick={() => setSelectedPlanId(null)}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'var(--accent)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Plans
            </button>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column: Plan Overview & Stats */}
              <div className="lg:col-span-2 space-y-6">
                {/* Plan Header Card */}
                <div className="card p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                          background: displayPlan.planType === 'ai-generated' 
                            ? 'linear-gradient(135deg, var(--accent), #9333ea)' 
                            : 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                        }}>
                          {displayPlan.planType === 'ai-generated' ? (
                            <Brain className="w-5 h-5 text-white" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--text-strong)' }}>
                              Week {displayPlan.weekNumber}
                            </h2>
                            <span className="text-xs px-2 py-1 rounded font-medium" style={{ 
                              background: displayPlan.planType === 'ai-generated' ? 'rgba(var(--accent-rgb), 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              color: displayPlan.planType === 'ai-generated' ? 'var(--accent)' : '#3b82f6'
                            }}>
                              {displayPlan.planType === 'ai-generated' ? 'AI Plan' : 'Custom'}
                            </span>
                          </div>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                            {new Date(displayPlan.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(displayPlan.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {displayPlan.customPrompt && (
                        <div className="p-3 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                          <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
                            "{displayPlan.customPrompt}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.05), rgba(147, 51, 234, 0.05))' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>
                          Overall Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                          {displayProgress}%
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {displayPlan.completedTaskCount} of {displayPlan.totalTaskCount} tasks
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                      <div 
                        className="h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${displayProgress}%`, 
                          background: 'linear-gradient(90deg, var(--accent), #9333ea)'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* AI Insights Card */}
                <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.03), rgba(147, 51, 234, 0.03))' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent), #9333ea)' }}>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-strong)' }}>
                        AI Insights
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {displayPlan.aiInsights}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Task List Card */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
                      <Target className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                      Learning Tasks
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>
                      {displayPlan.tasks.filter(t => !t.isCompleted).length} remaining
                    </span>
                  </div>
                  <div className="space-y-3">
                    {displayPlan.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="group p-4 rounded-xl transition-all duration-200 hover:shadow-md"
                        style={{
                          background: task.isCompleted ? 'rgba(34, 197, 94, 0.05)' : 'rgba(0,0,0,0.02)',
                          border: task.isCompleted ? '2px solid rgba(34, 197, 94, 0.2)' : '2px solid transparent',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                            className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                          >
                            {task.isCompleted ? (
                              <CheckCircle2 className="w-6 h-6" style={{ color: '#22c55e' }} />
                            ) : (
                              <Circle className="w-6 h-6 opacity-40 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 
                                className="font-semibold leading-tight"
                                style={{ 
                                  color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-strong)',
                                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                                }}
                              >
                                {task.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span 
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
                                  style={{
                                    background: task.taskType === 'learn' ? 'rgba(59, 130, 246, 0.12)' :
                                               task.taskType === 'practice' ? 'rgba(var(--accent-rgb), 0.12)' :
                                               'rgba(168, 85, 247, 0.12)',
                                    color: task.taskType === 'learn' ? '#2563eb' :
                                           task.taskType === 'practice' ? 'var(--accent)' :
                                           '#9333ea',
                                  }}
                                >
                                  {task.taskType}
                                </span>
                                <span className="text-xs flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}>
                                  <Clock className="w-3 h-3" />
                                  {task.estimatedMinutes}m
                                </span>
                              </div>
                            </div>
                            <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                <span className="px-2 py-1 rounded" style={{ background: 'rgba(var(--accent-rgb), 0.08)' }}>
                                  {task.subject}
                                </span>
                                <span>•</span>
                                <span>{task.topic}</span>
                                {task.targetCount > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{task.targetCount} questions</span>
                                  </>
                                )}
                              </div>
                              {task.taskType === 'learn' && !task.isCompleted && (
                                <button
                                  onClick={() => {
                                    setChatbotTopic(task.topic);
                                    setChatbotContext(`**Task:** ${task.title}\n\n**Description:** ${task.description}\n\n**Subject:** ${task.subject}\n\n**Estimated Time:** ${task.estimatedMinutes} minutes`);
                                    setShowChatbot(true);
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-md"
                                  style={{ background: 'linear-gradient(135deg, var(--accent), #9333ea)', color: 'white' }}
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Learn with AI
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Goals & Focus Areas */}
              <div className="space-y-6">
                {/* Goals Card */}
                <div className="card p-6 sticky top-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}>
                      <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-strong)' }}>
                      Weekly Goals
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {displayGoals.map((goal: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(var(--accent-rgb), 0.15)' }}>
                          <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{index + 1}</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                          {goal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Focus Areas Card */}
                {displayFocusAreas.length > 0 && (
                  <div className="card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                        <BarChart3 className="w-5 h-5" style={{ color: '#ef4444' }} />
                      </div>
                      <h3 className="font-bold text-lg" style={{ color: 'var(--text-strong)' }}>
                        Focus Areas
                      </h3>
                    </div>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                      Topics needing improvement
                    </p>
                    <div className="space-y-2">
                      {displayFocusAreas.map((area: any, index: number) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg border"
                          style={{ 
                            background: 'rgba(239, 68, 68, 0.03)',
                            borderColor: 'rgba(239, 68, 68, 0.15)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>
                              {area.subject}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: '#ef4444', color: 'white' }}>
                              {area.accuracy}%
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {area.topic}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Show plan list view
          <div className="max-w-6xl mx-auto">
            {/* Header with Create Buttons */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
                    AI Study Coach
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Your personalized learning companion
                  </p>
                </div>
              </div>

              {/* Create Plan Buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={generateNewPlan}
                  disabled={generating}
                  className="group p-6 rounded-xl border-2 border-transparent hover:border-[color:var(--accent)] transition-all duration-300 text-left"
                  style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.05), rgba(147, 51, 234, 0.05))' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, var(--accent), #9333ea)' }}>
                      {generating ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Brain className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: 'var(--text-strong)' }}>
                        {generating ? 'Generating...' : 'AI-Generated Plan'}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent)' }}>
                        Recommended
                      </span>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    AI analyzes your performance and creates a targeted plan
                  </p>
                </button>

                <button
                  onClick={() => setShowCustomModal(true)}
                  disabled={generating}
                  className="group p-6 rounded-xl border-2 border-transparent hover:border-[color:var(--accent)] transition-all duration-300 text-left"
                  style={{ background: 'rgba(59, 130, 246, 0.05)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-strong)' }}>
                      Custom Plan
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Choose your own topics, timeframe, and difficulty level
                  </p>
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <p className="text-sm" style={{ color: '#ef4444' }}>
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Plans Grid */}
            {allPlans.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-strong)' }}>
                    Your Study Plans
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>
                    {allPlans.length} {allPlans.length === 1 ? 'plan' : 'plans'}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allPlans.map((planItem) => {
                    const planProgress = Math.round((planItem.completedTaskCount / planItem.totalTaskCount) * 100);
                    const isActive = planItem.id === plan?.id;
                    return (
                      <div
                        key={planItem.id}
                        onClick={() => setSelectedPlanId(planItem.id)}
                        className="group card p-5 hover:shadow-xl transition-all duration-300 cursor-pointer border-2"
                        style={{
                          borderColor: isActive ? 'var(--accent)' : 'transparent',
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                              background: planItem.planType === 'ai-generated' 
                                ? 'linear-gradient(135deg, var(--accent), #9333ea)' 
                                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                            }}>
                              {planItem.planType === 'ai-generated' ? (
                                <Brain className="w-5 h-5 text-white" />
                              ) : (
                                <BookOpen className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold" style={{ color: 'var(--text-strong)' }}>
                                Week {planItem.weekNumber}
                              </h3>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {planItem.planType === 'ai-generated' ? 'AI Plan' : 'Custom'}
                              </p>
                            </div>
                          </div>
                          {isActive && (
                            <span className="text-xs px-2 py-1 rounded font-medium" style={{ background: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent)' }}>
                              Active
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                              Progress
                            </span>
                            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                              {planProgress}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                            <div 
                              className="h-2 rounded-full transition-all"
                              style={{ 
                                width: `${planProgress}%`, 
                                background: 'linear-gradient(90deg, var(--accent), #9333ea)'
                              }}
                            ></div>
                          </div>
                        </div>

                        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                          {new Date(planItem.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                          {new Date(planItem.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>

                        {planItem.customPrompt && (
                          <p className="text-xs italic line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                            "{planItem.customPrompt}"
                          </p>
                        )}

                        <div className="mt-4 pt-3 border-t border-black/5">
                          <div className="flex items-center justify-between text-xs">
                            <span style={{ color: 'var(--text-muted)' }}>
                              {planItem.totalTaskCount} tasks
                            </span>
                            <span className="font-medium group-hover:translate-x-1 transition-transform" style={{ color: 'var(--accent)' }}>
                              View details →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {allPlans.length === 0 && !generating && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}>
                  <Sparkles className="w-10 h-10" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
                  No Plans Yet
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Create your first study plan to get started
                </p>
              </div>
            )}
          </div>
        )}

        {/* Custom Plan Modal */}
        <CustomPlanModal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onGenerate={generateCustomPlan}
          isGenerating={generating}
        />

        {/* Study Coach Chatbot */}
        {showChatbot && (
          <StudyCoachChatbot
            initialTopic={chatbotTopic}
            initialContext={chatbotContext}
            isOpen={showChatbot}
            onClose={() => setShowChatbot(false)}
          />
        )}

        {/* Adaptive AI Tutor - Always Available */}
        <AdaptiveChatbot />
      </main>
    </div>
  );
}
