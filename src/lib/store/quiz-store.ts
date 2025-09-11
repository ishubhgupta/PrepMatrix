import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, QuestionState, QuizSession, SubjectProgress, DailyStats } from '@/types';
import { allQuestions } from '@/data';

interface QuizState {
  // Current quiz session
  currentSession: QuizSession | null;
  questionStates: Record<string, QuestionState>;
  
  // Progress tracking
  subjectProgress: Record<string, SubjectProgress>;
  dailyStats: DailyStats[];
  
  // Generated questions (from AI)
  generatedQuestions: Question[];
  
  // Actions
  startQuizSession: (questions: Question[]) => void;
  endQuizSession: () => void;
  answerQuestion: (questionId: string, selectedOption: number, timeSpent: number) => void;
  flagQuestion: (questionId: string, flagged: boolean) => void;
  addNoteToQuestion: (questionId: string, note: string) => void;
  addGeneratedQuestion: (question: Question) => void;
  resetProgress: () => void;
  
  // Getters
  getQuestionState: (questionId: string) => QuestionState;
  getSubjectProgress: (subject: string) => SubjectProgress;
  getIncorrectQuestions: () => Question[];
  getFlaggedQuestions: () => Question[];
}

const createDefaultQuestionState = (questionId: string): QuestionState => ({
  questionId,
  answered: false,
  selectedOption: null,
  correct: null,
  timeSpent: 0,
  flagged: false,
  notes: '',
  attempts: 0,
});

const createDefaultSubjectProgress = (subject: string): SubjectProgress => {
  const subjectQuestions = allQuestions.filter(q => q.subject === subject);
  return {
    subject,
    totalQuestions: subjectQuestions.length,
    answeredQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    averageTimePerQuestion: 0,
    lastActivity: Date.now(),
    streak: 0,
  };
};

const updateDailyStats = (dailyStats: DailyStats[], correct: boolean, timeSpent: number, subject: string): DailyStats[] => {
  const today = new Date().toISOString().split('T')[0];
  const existingIndex = dailyStats.findIndex(stat => stat.date === today);
  
  if (existingIndex >= 0) {
    const updated = [...dailyStats];
    const existing = updated[existingIndex];
    updated[existingIndex] = {
      ...existing,
      questionsAnswered: existing.questionsAnswered + 1,
      correctAnswers: existing.correctAnswers + (correct ? 1 : 0),
      timeSpent: existing.timeSpent + timeSpent,
      subjectsStudied: existing.subjectsStudied.includes(subject) 
        ? existing.subjectsStudied 
        : [...existing.subjectsStudied, subject],
    };
    return updated;
  }
  
  const newStat: DailyStats = {
    date: today,
    questionsAnswered: 1,
    correctAnswers: correct ? 1 : 0,
    timeSpent,
    subjectsStudied: [subject],
  };
  
  return [...dailyStats, newStat];
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      questionStates: {},
      subjectProgress: {},
      dailyStats: [],
      generatedQuestions: [],

      // Actions
      startQuizSession: (questions) => {
        const session: QuizSession = {
          questions,
          currentQuestionIndex: 0,
          questionStates: {},
          startTime: Date.now(),
          totalTimeSpent: 0,
        };
        set({ currentSession: session });
      },

      endQuizSession: () => {
        const session = get().currentSession;
        if (session) {
          const totalTime = Date.now() - session.startTime;
          set((state) => ({
            currentSession: null,
            questionStates: { ...state.questionStates, ...session.questionStates },
          }));
        }
      },

      answerQuestion: (questionId, selectedOption, timeSpent) => {
        const question = allQuestions.find(q => q.id === questionId) || 
                        get().generatedQuestions.find(q => q.id === questionId);
        
        if (!question) return;

        const correct = question.options[selectedOption]?.correct || false;
        const state = get();
        
        // Update question state
        const questionState: QuestionState = {
          ...(state.questionStates[questionId] || createDefaultQuestionState(questionId)),
          answered: true,
          selectedOption,
          correct,
          timeSpent: timeSpent,
          attempts: (state.questionStates[questionId]?.attempts || 0) + 1,
        };

        // Update subject progress
        const subject = question.subject;
        const currentProgress = state.subjectProgress[subject] || createDefaultSubjectProgress(subject);
        const wasAnsweredBefore = state.questionStates[questionId]?.answered || false;
        
        const updatedProgress: SubjectProgress = {
          ...currentProgress,
          answeredQuestions: wasAnsweredBefore ? currentProgress.answeredQuestions : currentProgress.answeredQuestions + 1,
          correctAnswers: correct ? currentProgress.correctAnswers + 1 : currentProgress.correctAnswers,
          lastActivity: Date.now(),
          streak: correct ? currentProgress.streak + 1 : 0,
        };
        
        updatedProgress.accuracy = updatedProgress.answeredQuestions > 0 
          ? updatedProgress.correctAnswers / updatedProgress.answeredQuestions 
          : 0;

        // Update daily stats
        const updatedDailyStats = updateDailyStats(state.dailyStats, correct, timeSpent, subject);

        set({
          questionStates: { ...state.questionStates, [questionId]: questionState },
          subjectProgress: { ...state.subjectProgress, [subject]: updatedProgress },
          dailyStats: updatedDailyStats,
        });
      },

      flagQuestion: (questionId, flagged) => {
        const state = get();
        const questionState = state.questionStates[questionId] || createDefaultQuestionState(questionId);
        
        set({
          questionStates: {
            ...state.questionStates,
            [questionId]: { ...questionState, flagged },
          },
        });
      },

      addNoteToQuestion: (questionId, note) => {
        const state = get();
        const questionState = state.questionStates[questionId] || createDefaultQuestionState(questionId);
        
        set({
          questionStates: {
            ...state.questionStates,
            [questionId]: { ...questionState, notes: note },
          },
        });
      },

      addGeneratedQuestion: (question) => {
        set((state) => ({
          generatedQuestions: [...state.generatedQuestions, question],
        }));
      },

      resetProgress: () => {
        set({
          questionStates: {},
          subjectProgress: {},
          dailyStats: [],
          generatedQuestions: [],
          currentSession: null,
        });
      },

      // Getters
      getQuestionState: (questionId) => {
        const state = get();
        return state.questionStates[questionId] || createDefaultQuestionState(questionId);
      },

      getSubjectProgress: (subject) => {
        const state = get();
        return state.subjectProgress[subject] || createDefaultSubjectProgress(subject);
      },

      getIncorrectQuestions: () => {
        const state = get();
        const incorrectIds = Object.entries(state.questionStates)
          .filter(([_, questionState]) => questionState.answered && !questionState.correct)
          .map(([id]) => id);
        
        return [...allQuestions, ...state.generatedQuestions]
          .filter(q => incorrectIds.includes(q.id));
      },

      getFlaggedQuestions: () => {
        const state = get();
        const flaggedIds = Object.entries(state.questionStates)
          .filter(([_, questionState]) => questionState.flagged)
          .map(([id]) => id);
        
        return [...allQuestions, ...state.generatedQuestions]
          .filter(q => flaggedIds.includes(q.id));
      },
    }),
    {
      name: 'prepmatrix-quiz',
      partialize: (state) => ({
        questionStates: state.questionStates,
        subjectProgress: state.subjectProgress,
        dailyStats: state.dailyStats,
        generatedQuestions: state.generatedQuestions,
      }),
    }
  )
);
