'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionContext: {
    question: string;
    correctAnswer: string;
    rationale: string;
  };
}

export function AIChatModal({ isOpen, onClose, questionContext }: AIChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi! I'm here to help you understand this question better. Feel free to ask me anything about the question, concepts involved, or request hints!`,
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation context
      const conversationContext = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        .join('\n');

      const response = await fetch('/api/ai/explain/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Context:
Question: ${questionContext.question}
Correct Answer: ${questionContext.correctAnswer}
Explanation: ${questionContext.rationale}

${conversationContext ? `Previous conversation:
${conversationContext}

` : ''}User asks: ${userMessage.content}

Provide a concise, direct answer in under 150 words. Use bullet points for clarity when appropriate.`,
          correctAnswer: questionContext.correctAnswer,
          rationale: questionContext.rationale,
          level: 'simple',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.explanation,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
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
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-strong)' }}>
                AI Discussion
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Ask me anything about this question
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
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? '' 
                    : ''
                }`} style={{
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
                <div className={`rounded-lg p-3`} style={{
                  backgroundColor: message.role === 'user' ? 'var(--accent)' : 'var(--accent-soft)',
                  color: message.role === 'user' ? 'white' : 'var(--text-strong)'
                }}>
                  {message.role === 'user' ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  ) : (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
                  <p className={`text-xs mt-1 opacity-70`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
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
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setInput("Can you explain this in simpler terms?")}
              className="px-3 py-1 text-xs rounded-full hover:opacity-70 transition-opacity"
              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              Explain simpler
            </button>
            <button
              onClick={() => setInput("What are the key concepts I should understand?")}
              className="px-3 py-1 text-xs rounded-full hover:opacity-70 transition-opacity"
              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              Key concepts
            </button>
            <button
              onClick={() => setInput("Can you give me a hint?")}
              className="px-3 py-1 text-xs rounded-full hover:opacity-70 transition-opacity"
              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              Give hint
            </button>
            <button
              onClick={() => setInput("Why is this the correct answer?")}
              className="px-3 py-1 text-xs rounded-full hover:opacity-70 transition-opacity"
              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              Why correct?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
