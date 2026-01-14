import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Topic lists for diverse question generation
function getTopicsForSubject(subject: string): string[] {
  const topicMap: Record<string, string[]> = {
    'DBMS': [
      'Normalization and Database Design',
      'ACID Properties and Transactions',
      'Indexing and Query Optimization',
      'SQL vs NoSQL',
      'Concurrency Control',
      'Database Sharding and Replication',
      'ER Diagrams and Relationships',
      'Stored Procedures and Triggers'
    ],
    'Operating Systems': [
      'Process and Thread Management',
      'CPU Scheduling Algorithms',
      'Memory Management',
      'Deadlock Detection and Prevention',
      'File Systems',
      'Virtual Memory',
      'Inter-Process Communication',
      'System Calls'
    ],
    'Python & ML': [
      'Python Data Structures',
      'Supervised Learning Algorithms',
      'Unsupervised Learning',
      'Model Evaluation Metrics',
      'Feature Engineering',
      'Deep Learning Fundamentals',
      'Overfitting and Regularization',
      'Ensemble Methods'
    ],
    'GenAI & LLMs': [
      'Transformer Architecture',
      'Attention Mechanisms',
      'Prompt Engineering',
      'Fine-tuning vs RAG',
      'Token Embeddings',
      'Hallucination and Mitigation',
      'LLM Evaluation Metrics',
      'Chain-of-Thought Reasoning'
    ],
    'C++ & OOP': [
      'Classes and Objects',
      'Inheritance and Polymorphism',
      'Virtual Functions',
      'Memory Management and Pointers',
      'STL Containers',
      'Move Semantics',
      'Design Patterns',
      'RAII and Smart Pointers'
    ],
  };
  
  return topicMap[subject] || [];
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, difficulty, role } = await req.json();

    if (!subject || !difficulty || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get topic list for diverse question generation
    const topicList = getTopicsForSubject(subject);
    
    // Create mock interview session
    const interview = await prisma.mockInterview.create({
      data: {
        userId: user.id,
        subject,
        difficulty,
        role,
        status: 'in-progress',
        mode: 'voice',
        interviewerProfile: 'professional',
        startedAt: new Date(),
      },
    });

    // Generate first question using AI with specific topic
    let questionText: string;
    const firstTopic = topicList[0] || subject;
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const prompt = `You are conducting a ${difficulty} level technical interview for a ${role} position focusing on ${subject}.

This is the FIRST question. Focus specifically on this topic: ${firstTopic}

Generate an interview question about ${firstTopic}. The question should:
1. Be appropriate for ${difficulty} level
2. Test practical knowledge relevant to ${role}
3. Be open-ended to allow detailed explanation
4. Focus specifically on ${firstTopic}

Return ONLY the question text, nothing else.`;

      const result = await model.generateContent(prompt);
      questionText = result.response.text().trim();
    } catch (aiError: any) {
      console.error('AI generation failed, using fallback question:', aiError);
      
      // Fallback questions by subject and difficulty
      const fallbackQuestions: Record<string, Record<string, string>> = {
        'DBMS': {
          'beginner': 'What is a database? Explain the difference between SQL and NoSQL databases.',
          'intermediate': 'Explain ACID properties in database transactions with real-world examples.',
          'advanced': 'How would you design a database schema for a high-traffic e-commerce platform? Discuss normalization, indexing, and partitioning strategies.',
        },
        'Operating Systems': {
          'beginner': 'What is an operating system? Explain its main functions.',
          'intermediate': 'Explain the difference between process and thread. What are the benefits of multithreading?',
          'advanced': 'Describe different CPU scheduling algorithms and explain when you would use each one.',
        },
        'Python & ML': {
          'beginner': 'What are the key differences between lists and tuples in Python?',
          'intermediate': 'Explain the bias-variance tradeoff in machine learning.',
          'advanced': 'How would you approach building a recommendation system for a streaming platform? Discuss data preprocessing, model selection, and evaluation metrics.',
        },
        'GenAI & LLMs': {
          'beginner': 'What is a Large Language Model? How is it different from traditional machine learning models?',
          'intermediate': 'Explain the concept of prompt engineering and why it\'s important in working with LLMs.',
          'advanced': 'Discuss the architecture of transformer models. How does self-attention mechanism work?',
        },
        'C++ & OOP': {
          'beginner': 'What are the four pillars of Object-Oriented Programming? Explain each briefly.',
          'intermediate': 'Explain the difference between virtual functions and pure virtual functions in C++.',
          'advanced': 'Discuss memory management in C++. What are smart pointers and when should you use them?',
        },
      };
      
      questionText = fallbackQuestions[subject]?.[difficulty] || 
        `Tell me about your experience with ${subject}. What aspects do you find most challenging?`;
    }

    // Save first question
    const question = await prisma.mockInterviewQuestion.create({
      data: {
        interviewId: interview.id,
        questionNumber: 1,
        question: questionText,
        isFollowUp: false,
      },
    });

    return NextResponse.json({
      success: true,
      interview: {
        id: interview.id,
        subject: interview.subject,
        difficulty: interview.difficulty,
        role: interview.role,
      },
      currentQuestion: {
        id: question.id,
        number: question.questionNumber,
        text: questionText,
      },
    });
  } catch (error) {
    console.error('Error starting mock interview:', error);
    return NextResponse.json(
      { error: 'Failed to start interview' },
      { status: 500 }
    );
  }
}
