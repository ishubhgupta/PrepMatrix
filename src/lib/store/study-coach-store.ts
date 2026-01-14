import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  weekNumber: number;
  startDate: string;
  endDate: string;
  focusAreas: string;
  goals: string;
  aiInsights: string;
  completedTaskCount: number;
  totalTaskCount: number;
  tasks: StudyTask[];
}

interface StudyCoachStore {
  plan: StudyPlan | null;
  lastFetched: number | null;
  setPlan: (plan: StudyPlan | null) => void;
  clearPlan: () => void;
  shouldRefetch: () => boolean;
}

export const useStudyCoachStore = create<StudyCoachStore>()(
  persist(
    (set, get) => ({
      plan: null,
      lastFetched: null,
      setPlan: (plan) => set({ plan, lastFetched: Date.now() }),
      clearPlan: () => set({ plan: null, lastFetched: null }),
      shouldRefetch: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        // Refetch if data is older than 5 minutes
        const fiveMinutes = 5 * 60 * 1000;
        return Date.now() - lastFetched > fiveMinutes;
      },
    }),
    {
      name: 'study-coach-storage',
    }
  )
);
