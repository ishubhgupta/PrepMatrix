'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Lightbulb, RefreshCw, MessageCircle } from 'lucide-react';

export function AIFeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Lightbulb,
      title: 'Adaptive Explanations',
      description: 'AI analyzes your learning style and adjusts explanations from beginner to expert level. Get code examples, analogies, and step-by-step breakdowns that match your understanding.',
      benefit: 'Learn at your own pace',
    },
    {
      icon: RefreshCw,
      title: 'Infinite Practice Variations',
      description: 'Generate unlimited similar questions with different scenarios and complexity levels. The AI ensures each variation tests the same concept while keeping practice fresh and engaging.',
      benefit: 'Never run out of questions',
    },
    {
      icon: MessageCircle,
      title: 'Personal AI Tutor',
      description: 'Ask follow-up questions, request clarifications, or explore related concepts through natural conversation. Get immediate, context-aware responses tailored to your current topic.',
      benefit: '24/7 personalized support',
    },
  ];

  return (
    <div ref={sectionRef} className="card p-8 md:p-16 overflow-hidden relative">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        color: 'var(--text-strong)'
      }}></div>

      <div className="relative z-10">
        {/* Header with scroll fade-in */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'var(--accent)', letterSpacing: '0.15em' }}>
              AI-Powered Learning
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: 'var(--text-strong)', letterSpacing: '0.01em' }}>
            Your Personal Interview Coach
          </h2>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Powered by Google Gemini, our AI doesn't just show you answers—it teaches you to think like an interviewer, 
            understand concepts deeply, and build genuine confidence through adaptive, personalized guidance.
          </p>
        </div>

        {/* Feature cards with staggered scroll animations */}
        <div className="space-y-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-700 delay-${index * 150} ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-2xl transition-all duration-300 hover:translate-x-2" 
                  style={{ background: 'rgba(0,0,0,0.02)' }}>
                  
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" 
                      style={{ background: 'var(--accent-soft)' }}>
                      <Icon className="w-8 h-8" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text-strong)' }}>
                        {feature.title}
                      </h3>
                      <span className="hidden md:inline-block text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ml-4" 
                        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        {feature.benefit}
                      </span>
                    </div>
                    
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {feature.description}
                    </p>

                    <span className="md:hidden inline-block text-xs font-medium px-3 py-1.5 rounded-full mt-3" 
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      {feature.benefit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action with fade-in */}
        <div 
          className={`text-center transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
        </div>
      </div>
    </div>
  );
}
