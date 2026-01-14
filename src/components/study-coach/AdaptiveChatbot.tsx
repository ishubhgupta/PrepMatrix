'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, Brain, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LearningProfile {
  pace: string;
  style: string;
}

export function AdaptiveChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
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
    // Welcome message when first opened
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hi! I'm your adaptive AI tutor. 🎓\n\nI adapt to **your learning style** and pace. Whether you need detailed explanations or quick answers, I'll adjust to help you learn best.\n\nWhat would you like to learn about today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

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
      const response = await fetch('/api/study-coach/adaptive-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (data.learningProfile) {
        setLearningProfile(data.learningProfile);
      }

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

  // Get learning pace icon and color
  const getLearningPaceDisplay = () => {
    if (!learningProfile) return null;
    
    const { pace, style } = learningProfile;
    let icon = <Brain className="w-3 h-3" />;
    let color = '#10b981';
    let text = pace;

    if (pace === 'slow') {
      icon = <Brain className="w-3 h-3" />;
      color = '#f59e0b';
      text = 'Detailed Mode';
    } else if (pace === 'fast') {
      icon = <Zap className="w-3 h-3" />;
      color = '#8b5cf6';
      text = 'Fast Mode';
    } else {
      icon = <Sparkles className="w-3 h-3" />;
      color = '#10b981';
      text = 'Balanced Mode';
    }

    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium" style={{ background: `${color}15`, color }}>
        {icon}
        <span>{text}</span>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group animate-pulse hover:animate-none"
        style={{ background: 'linear-gradient(135deg, var(--accent), #9333ea)' }}
        aria-label="Open AI tutor"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'var(--bg-bone)', color: 'var(--text-strong)', boxShadow: 'var(--shadow-softer)' }}>
          AI Tutor (Adaptive)
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Chat Modal */}
      <div className="relative w-full max-w-3xl h-[700px] rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.05), rgba(147, 51, 234, 0.05))' }}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), #9333ea)' }}>
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center" style={{ background: '#10b981' }}>
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
                Adaptive AI Tutor
                <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              </h2>
              <p className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <span>Learns your pace</span>
                {learningProfile && (
                  <>
                    <span>•</span>
                    {getLearningPaceDisplay()}
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                  message.role === 'user' ? '' : 'ring-2 ring-purple-100'
                }`} style={{
                  background: message.role === 'user'
                    ? 'var(--accent)'
                    : 'linear-gradient(135deg, #9333ea, #ec4899)'
                }}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="flex-1">
                  <div className="rounded-2xl p-4 shadow-sm" style={{
                    backgroundColor: message.role === 'user' ? 'var(--accent)' : 'rgba(0,0,0,0.02)',
                    color: message.role === 'user' ? 'white' : 'var(--text-strong)'
                  }}>
                    {message.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    ) : (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:my-2 prose-strong:font-bold prose-code:text-xs prose-code:bg-black/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <p className="text-xs mt-1.5 px-1" style={{ color: 'var(--text-muted)' }}>
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
              <div className="flex items-start space-x-3 max-w-[85%]">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ring-2 ring-purple-100" style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)', animationDelay: '0.15s' }}></div>
                    <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)', animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)', background: 'rgba(0,0,0,0.01)' }}>
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-black/8 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 outline-none transition-all text-sm disabled:opacity-50"
              style={{ background: 'var(--bg-bone)', color: 'var(--text-strong)' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--accent), #9333ea)' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs mt-2 px-1" style={{ color: 'var(--text-muted)' }}>
            Press Enter to send • I adapt to your learning style
          </p>
        </div>

        {/* Quick Actions */}
        <div className="px-5 pb-5">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setInput("Explain this in simple terms")}
              className="px-3 py-1.5 text-xs rounded-lg hover:shadow-md transition-all font-medium"
              style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.08)', color: 'var(--accent)' }}
              disabled={isLoading}
            >
              Simplify explanation
            </button>
            <button
              onClick={() => setInput("Give me an example")}
              className="px-3 py-1.5 text-xs rounded-lg hover:shadow-md transition-all font-medium"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6' }}
              disabled={isLoading}
            >
              Show example
            </button>
            <button
              onClick={() => setInput("I don't understand, explain differently")}
              className="px-3 py-1.5 text-xs rounded-lg hover:shadow-md transition-all font-medium"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444' }}
              disabled={isLoading}
            >
              Explain differently
            </button>
            <button
              onClick={() => setInput("Quiz me on this topic")}
              className="px-3 py-1.5 text-xs rounded-lg hover:shadow-md transition-all font-medium"
              style={{ backgroundColor: 'rgba(168, 85, 247, 0.08)', color: '#a855f7' }}
              disabled={isLoading}
            >
              Quiz me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
