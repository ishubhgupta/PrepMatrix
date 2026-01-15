// Core question and quiz types
export interface Question {
  id: string;
  subject: 'DBMS' | 'PythonML' | 'CppOOP' | 'GenAI' | 'OS';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: Array<{
    text: string;
    correct: boolean;
  }>;
  rationale: string;
}

export interface GeneratedQuestion extends Question {
  isGenerated: true;
  originalQuestionId: string;
}

// Quiz state types
export interface QuestionState {
  questionId: string;
  answered: boolean;
  selectedOption: number | null;
  correct: boolean | null;
  timeSpent: number;
  flagged: boolean;
  notes: string;
  attempts: number;
}

export interface QuizSession {
  questions: Question[];
  currentQuestionIndex: number;
  questionStates: Record<string, QuestionState>;
  startTime: number;
  totalTimeSpent: number;
}

// Filter types
export interface QuizFilters {
  subjects: string[];
  topics: string[];
  difficulties: string[];
}

// Progress tracking
export interface SubjectProgress {
  subject: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTimePerQuestion: number;
  lastActivity: number;
  streak: number;
}

export interface DailyStats {
  date: string;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
  subjectsStudied: string[];
}

// AI/Gemini types
export interface GeminiConfig {
  apiKey: string | null;
  enabled: boolean;
  lastValidated: number | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  context?: {
    questionId: string;
    subject: string;
    topic: string;
  };
}

export interface ChatSession {
  id: string;
  subject: string;
  topic: string;
  messages: ChatMessage[];
  lastActivity: number;
}

// Settings and preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  showCharts: boolean;
  compactCards: boolean;
  autoRevealRationale: boolean;
  playSuccessSounds: boolean;
  keyboardShortcuts: boolean;
  soundEffects: boolean;
  notifications: boolean;
}

// API types for Gemini integration
export interface GenerateSimilarQuestionRequest {
  question: string;
  options: Array<{ text: string; correct: boolean }>;
  rationale: string;
  subject: string;
  topic: string;
  difficulty: string;
}

export interface ExplainLikeRequest {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  rationale: string;
  mode: 'like-5' | 'new-topic' | 'with-sql' | 'with-code';
}

export interface TutorChatRequest {
  messages: ChatMessage[];
  subject: string;
  topic: string;
  context?: {
    questionId: string;
    userAnswer?: string;
    correctAnswer?: string;
  };
}

// Storage types
export interface StoredData {
  version: string;
  preferences: UserPreferences;
  progress: Record<string, SubjectProgress>;
  questionStates: Record<string, QuestionState>;
  dailyStats: DailyStats[];
  lastBackup: number;
}

// Chart data types
export interface TopicDistribution {
  topic: string;
  count: number;
  subject: string;
}

export interface DifficultyDistribution {
  difficulty: string;
  count: number;
  percentage: number;
}

// Utility types
export type QuestionAnswer = {
  questionId: string;
  selectedOption: number;
  correct: boolean;
  timeSpent: number;
};

export type SubjectKey = Question['subject'];
export type DifficultyLevel = Question['difficulty'];

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface GeminiError extends AppError {
  retryAfter?: number;
  quotaExceeded?: boolean;
}
