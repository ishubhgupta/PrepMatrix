'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface StudyCoachChatbotProps {
  initialTopic?: string;
  initialContext?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function StudyCoachChatbot({ initialTopic, initialContext, isOpen, onClose }: StudyCoachChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialTopic && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hi! I'm your AI Study Coach. I can help you learn about **${initialTopic}**${initialContext ? `\n\n${initialContext}` : ''}.\n\nWhat would you like to know or where should we start?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [initialTopic, initialContext]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/study-coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: initialContext || '',
          topic: initialTopic || '',
          history: messages.slice(-6), // Last 3 exchanges
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Chat Modal */}
      <div className="relative w-full max-w-3xl h-[600px] rounded-lg shadow-xl flex flex-col" style={{ backgroundColor: 'var(--bg-card)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--accent), #9333ea)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-strong)' }}>
                AI Study Coach
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {initialTopic || 'Your personal learning assistant'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !initialTopic && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), #9333ea)' }}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-strong)' }}>
                Ready to learn?
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Ask me anything about your study topics, and I'll help you understand!
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center`} style={{
                  background: message.role === 'user'
                    ? 'var(--accent)'
                    : 'linear-gradient(135deg, #9333ea, #ec4899)'
                }}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="rounded-lg p-3" style={{
                  backgroundColor: message.role === 'user' ? 'var(--accent)' : 'var(--accent-soft)',
                  color: message.role === 'user' ? 'white' : 'var(--text-strong)'
                }}>
                  {message.role === 'user' ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  ) : (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0 prose-headings:my-2 prose-code:text-xs prose-code:bg-black/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/10 prose-pre:p-2">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--accent-soft)' }}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)', animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)', animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border input disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, var(--accent), #9333ea)' }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>

        {/* Quick suggestions */}
        {initialTopic && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setInput("Explain this concept in simple terms")}
                className="px-3 py-1 text-xs rounded-full hover:opacity-70 transition-opacity"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                Explain simply
              </button>
              <button
                onClick={() => setInput("What are real-world applications?")}
                className="px-3 py-1 text-xs rounded-full hover:opacity-70 transition-opacity"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                Real examples
              </button>
              <button
                onClick={() => setInput("What are common mistakes to avoid?")}
                className="px-3 py-1 text-xs rounded-full hover:opacity-70 transition-opacity"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                Common mistakes
              </button>
              <button
                onClick={() => setInput("Test my understanding with a question")}
                className="px-3 py-1 text-xs rounded-full hover:opacity-70 transition-opacity"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                Quiz me
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
