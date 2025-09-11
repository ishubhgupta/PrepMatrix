import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizFilters, QuestionState, UserPreferences } from '@/types';

interface UIState {
  // Theme and preferences
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  preferences: UserPreferences;
  
  // Filters
  filters: QuizFilters;
  
  // Modals and overlays
  settingsOpen: boolean;
  chatDrawerOpen: boolean;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarOpen: (open: boolean) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setFilters: (filters: Partial<QuizFilters>) => void;
  resetFilters: () => void;
  setSettingsOpen: (open: boolean) => void;
  setChatDrawerOpen: (open: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  reducedMotion: false,
  showCharts: true,
  compactCards: false,
  autoRevealRationale: false,
  playSuccessSounds: true,
  keyboardShortcuts: true,
};

const defaultFilters: QuizFilters = {
  subjects: [],
  topics: [],
  difficulties: [],
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: false,
      preferences: defaultPreferences,
      filters: defaultFilters,
      settingsOpen: false,
      chatDrawerOpen: false,

      // Actions
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // System theme
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.classList.toggle('dark', isDark);
        }
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      updatePreferences: (newPreferences) => {
        const preferences = { ...get().preferences, ...newPreferences };
        set({ preferences });
        
        // Apply theme if it changed
        if (newPreferences.theme) {
          get().setTheme(newPreferences.theme);
        }
      },

      setFilters: (newFilters) => {
        const filters = { ...get().filters, ...newFilters };
        set({ filters });
      },

      resetFilters: () => set({ filters: defaultFilters }),

      setSettingsOpen: (open) => set({ settingsOpen: open }),

      setChatDrawerOpen: (open) => set({ chatDrawerOpen: open }),
    }),
    {
      name: 'prepmatrix-ui',
      partialize: (state) => ({
        theme: state.theme,
        preferences: state.preferences,
        filters: state.filters,
      }),
    }
  )
);
