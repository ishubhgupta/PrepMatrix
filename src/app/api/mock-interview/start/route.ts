import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
    const questionCount = 5; // Total questions to generate
    
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

    console.log('Generating all questions upfront for interview:', interview.id);

    // Generate ALL questions upfront
    const questions = [];
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    for (let i = 0; i < questionCount; i++) {
      const questionNumber = i + 1;
      const topic = topicList[i] || `a different aspect of ${subject}`;
      let questionText: string;

      try {
        const prompt = `You are conducting a ${difficulty} level technical interview for a ${role} position focusing on ${subject}.

This is question #${questionNumber} of ${questionCount}. Focus specifically on this topic: ${topic}

${i > 0 ? `Previous topics covered: ${topicList.slice(0, i).join(', ')}` : ''}

Generate an interview question about ${topic}. The question should:
1. Be appropriate for ${difficulty} level
2. Test practical knowledge relevant to ${role}
3. Be open-ended to allow detailed explanation
4. Focus specifically on ${topic}
5. Be COMPLETELY DIFFERENT from previous topics

Return ONLY the question text, nothing else.`;

        const result = await model.generateContent(prompt);
        questionText = result.response.text().trim();
        console.log(`Generated question ${questionNumber}:`, questionText.substring(0, 80) + '...');
      } catch (aiError: any) {
        console.error(`AI generation failed for question ${questionNumber}, using fallback:`, aiError);
        
        // Fallback questions by subject and difficulty
        const fallbackQuestions: Record<string, Record<string, string[]>> = {
          'DBMS': {
            'beginner': [
              'What is a database? Explain the difference between SQL and NoSQL databases.',
              'What is a primary key? How does it differ from a foreign key?',
              'Explain what a database index is and why it\'s useful.',
              'What is normalization? Why is it important?',
              'Describe the different types of SQL JOINs.',
            ],
            'intermediate': [
              'Explain ACID properties in database transactions with real-world examples.',
              'What are database indexes and how do they improve query performance?',
              'Discuss different types of database relationships and when to use each.',
              'Explain the concept of database sharding and when it\'s necessary.',
              'What are stored procedures and triggers? Give use cases.',
            ],
            'advanced': [
              'How would you design a database schema for a high-traffic e-commerce platform?',
              'Discuss various concurrency control mechanisms in databases.',
              'Explain different database partitioning strategies and their trade-offs.',
              'How do you handle database replication and ensure consistency?',
              'Design a database solution for handling time-series data at scale.',
            ],
          },
          'Operating Systems': {
            'beginner': [
              'What is an operating system? Explain its main functions.',
              'What is the difference between a process and a program?',
              'Explain what virtual memory is.',
              'What are system calls? Give examples.',
              'Describe the role of a file system.',
            ],
            'intermediate': [
              'Explain the difference between process and thread. What are the benefits of multithreading?',
              'What is a deadlock? How can it be prevented?',
              'Discuss different memory management techniques.',
              'Explain inter-process communication methods.',
              'What are the different CPU scheduling algorithms?',
            ],
            'advanced': [
              'Describe different CPU scheduling algorithms and explain when you would use each one.',
              'How does the operating system handle page replacement? Compare algorithms.',
              'Explain how modern operating systems implement security and protection.',
              'Discuss the design of a modern file system with journaling.',
              'How would you design a real-time operating system?',
            ],
          },
          'Python & ML': {
            'beginner': [
              'What are the key differences between lists and tuples in Python?',
              'Explain what supervised and unsupervised learning are.',
              'What is overfitting? How can you prevent it?',
              'Describe the purpose of train-test split.',
              'What are the main Python data structures?',
            ],
            'intermediate': [
              'Explain the bias-variance tradeoff in machine learning.',
              'What are ensemble methods? Describe bagging and boosting.',
              'How do you handle imbalanced datasets?',
              'Explain cross-validation and why it\'s important.',
              'What is regularization and when should you use it?',
            ],
            'advanced': [
              'How would you approach building a recommendation system for a streaming platform?',
              'Discuss feature engineering techniques for improving model performance.',
              'Explain gradient descent and its variants.',
              'How would you deploy a machine learning model to production?',
              'Design an end-to-end ML pipeline for real-time predictions.',
            ],
          },
          'GenAI & LLMs': {
            'beginner': [
              'What is a Large Language Model? How is it different from traditional ML models?',
              'Explain what tokens are in the context of LLMs.',
              'What is prompt engineering?',
              'Describe what embeddings are.',
              'What are the main applications of GenAI?',
            ],
            'intermediate': [
              'Explain the concept of prompt engineering and why it\'s important in working with LLMs.',
              'What is the difference between fine-tuning and RAG?',
              'Discuss the concept of hallucination in LLMs.',
              'How do attention mechanisms work?',
              'What are the challenges in deploying LLMs?',
            ],
            'advanced': [
              'Discuss the architecture of transformer models. How does self-attention mechanism work?',
              'Explain different strategies for reducing LLM hallucinations.',
              'How would you implement a RAG system for a domain-specific application?',
              'Discuss chain-of-thought reasoning and its applications.',
              'Design a system for evaluating LLM outputs in production.',
            ],
          },
          'C++ & OOP': {
            'beginner': [
              'What are the four pillars of Object-Oriented Programming? Explain each briefly.',
              'What is the difference between a class and an object?',
              'Explain what encapsulation means.',
              'What are constructors and destructors?',
              'Describe the concept of inheritance.',
            ],
            'intermediate': [
              'Explain the difference between virtual functions and pure virtual functions in C++.',
              'What is polymorphism? Provide examples.',
              'Discuss the difference between stack and heap memory.',
              'What are abstract classes and interfaces?',
              'Explain method overloading and overriding.',
            ],
            'advanced': [
              'Discuss memory management in C++. What are smart pointers and when should you use them?',
              'Explain move semantics and rvalue references.',
              'What is RAII and why is it important?',
              'Discuss different design patterns and their use cases.',
              'How would you implement a custom memory allocator?',
            ],
          },
        };
        
        const subjectFallbacks = fallbackQuestions[subject]?.[difficulty] || [];
        questionText = subjectFallbacks[i] || `Tell me about your experience with ${topic}.`;
      }

      // Save question to database
      const question = await prisma.mockInterviewQuestion.create({
        data: {
          interviewId: interview.id,
          questionNumber,
          question: questionText,
          isFollowUp: false,
        },
      });

      questions.push({
        id: question.id,
        number: question.questionNumber,
        text: questionText,
      });
    }

    console.log(`Generated ${questions.length} questions for interview ${interview.id}`);

    return NextResponse.json({
      success: true,
      interview: {
        id: interview.id,
        subject: interview.subject,
        difficulty: interview.difficulty,
        role: interview.role,
        questionCount,
      },
      allQuestions: questions,
      currentQuestion: questions[0], // Start with first question
    });
  } catch (error) {
    console.error('Error starting mock interview:', error);
    return NextResponse.json(
      { error: 'Failed to start interview' },
      { status: 500 }
    );
  }
}
