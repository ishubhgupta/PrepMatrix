import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatSession, GeminiConfig } from '@/types';
import Cookies from 'js-cookie';

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

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      geminiConfig: {
        apiKey: null,
        enabled: false,
        lastValidated: null,
      },
      chatSessions: {},
      activeChatSession: null,

      // Actions
      setGeminiConfig: (config) => {
        const currentConfig = get().geminiConfig;
        const newConfig = { ...currentConfig, ...config };
        
        // Save API key to cookie if provided
        if (config.apiKey) {
          Cookies.set('gemini-api-key', config.apiKey, { expires: 30 }); // 30 days
        } else if (config.apiKey === null) {
          Cookies.remove('gemini-api-key');
        }
        
        set({ geminiConfig: newConfig });
      },

      validateGeminiKey: async (apiKey) => {
        try {
          console.log('Validating Gemini API key...');
          
          const response = await fetch('/api/ai/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apiKey }),
          });

          const data = await response.json();
          console.log('API Validation Response:', { status: response.status, data });
          
          if (response.ok && data.success && data.valid) {
            console.log('API key validation successful');
            get().setGeminiConfig({
              apiKey,
              enabled: true,
              lastValidated: Date.now(),
            });
            return true;
          } else {
            console.error('Gemini API validation failed:', data.error || 'Unknown error');
            return false;
          }
        } catch (error) {
          console.error('Gemini API validation failed with error:', error);
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
        const config = get().geminiConfig;
        return config.enabled && config.apiKey !== null;
      },
    }),
    {
      name: 'prepmatrix-chat',
      partialize: (state) => ({
        geminiConfig: {
          // Don't persist the API key for security - it should be in cookies
          apiKey: null,
          enabled: false,
          lastValidated: null,
        },
        chatSessions: state.chatSessions,
      }),
    }
  )
);
