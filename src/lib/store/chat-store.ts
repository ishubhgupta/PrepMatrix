import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatSession, GeminiConfig } from '@/types';

interface ChatState {
  // Gemini configuration
  geminiConfig: GeminiConfig;
  
  // Chat sessions by subject/topic
  chatSessions: Record<string, ChatSession>;
  activeChatSession: string | null;
  
  // Actions
  setGeminiConfig: (config: Partial<GeminiConfig>) => void;
  validateGeminiKey: (apiKey: string) => Promise<boolean>;
  createChatSession: (subject: string, topic: string) => string;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatSession: (sessionId: string) => void;
  setActiveChatSession: (sessionId: string | null) => void;
  
  // Getters
  getChatSession: (sessionId: string) => ChatSession | null;
  getActiveChatSession: () => ChatSession | null;
  isGeminiEnabled: () => boolean;
}

const generateSessionId = (subject: string, topic: string): string => {
  return `${subject}-${topic}`.toLowerCase().replace(/\s+/g, '-');
};

const generateMessageId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper to check if API key is configured (without exposing it)
const isApiKeyConfigured = (): boolean => {
  // Since API key is server-side only, we check if AI features work by trying to use them
  // The actual validation happens in the API routes
  return true; // Always return true, actual validation happens server-side
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state - API key is server-side only for security
      geminiConfig: {
        apiKey: null,
        enabled: true, // Enable by default, validation happens server-side
        lastValidated: null,
      },
      chatSessions: {},
      activeChatSession: null,

      // Actions
      setGeminiConfig: (config) => {
        const currentConfig = get().geminiConfig;
        set({
          geminiConfig: { ...currentConfig, ...config },
        });
      },

      validateGeminiKey: async (apiKey) => {
        try {
          // Simple validation call to Gemini API
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: 'Hello' }]
              }]
            }),
          });

          if (response.ok) {
            get().setGeminiConfig({
              apiKey,
              enabled: true,
              lastValidated: Date.now(),
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Gemini API validation failed:', error);
          return false;
        }
      },

      createChatSession: (subject, topic) => {
        const sessionId = generateSessionId(subject, topic);
        const existingSession = get().chatSessions[sessionId];
        
        if (existingSession) {
          set({ activeChatSession: sessionId });
          return sessionId;
        }

        const newSession: ChatSession = {
          id: sessionId,
          subject,
          topic,
          messages: [],
          lastActivity: Date.now(),
        };

        set((state) => ({
          chatSessions: { ...state.chatSessions, [sessionId]: newSession },
          activeChatSession: sessionId,
        }));

        return sessionId;
      },

      addMessage: (sessionId, messageData) => {
        const session = get().chatSessions[sessionId];
        if (!session) return;

        const message: ChatMessage = {
          ...messageData,
          id: generateMessageId(),
          timestamp: Date.now(),
        };

        const updatedSession: ChatSession = {
          ...session,
          messages: [...session.messages, message],
          lastActivity: Date.now(),
        };

        set((state) => ({
          chatSessions: { ...state.chatSessions, [sessionId]: updatedSession },
        }));
      },

      clearChatSession: (sessionId) => {
        const session = get().chatSessions[sessionId];
        if (!session) return;

        const clearedSession: ChatSession = {
          ...session,
          messages: [],
          lastActivity: Date.now(),
        };

        set((state) => ({
          chatSessions: { ...state.chatSessions, [sessionId]: clearedSession },
        }));
      },

      setActiveChatSession: (sessionId) => {
        set({ activeChatSession: sessionId });
      },

      // Getters
      getChatSession: (sessionId) => {
        return get().chatSessions[sessionId] || null;
      },

      getActiveChatSession: () => {
        const state = get();
        return state.activeChatSession ? state.chatSessions[state.activeChatSession] || null : null;
      },

      isGeminiEnabled: () => {
        // Since API key is server-side only, we assume it's enabled
        // Actual validation happens in API routes
        return get().geminiConfig.enabled;
      },
    }),
    {
      name: 'prepmatrix-chat',
      partialize: (state) => ({
        // Don't persist geminiConfig - always use environment variable
        chatSessions: state.chatSessions,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // API key is server-side only for security
          // Enable AI features by default, validation happens in API routes
          state.geminiConfig = {
            apiKey: null,
            enabled: true,
            lastValidated: Date.now(),
          };
        }
      },
    }
  )
);
