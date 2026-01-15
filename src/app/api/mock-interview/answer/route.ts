import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { analyzeVoiceMetrics, getVoiceMetricsFeedback } from '@/lib/voice-analysis';

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

    const { 
      interviewId, 
      questionId, 
      answer, 
      transcript,
      speakingDuration,
      answerAudioUrl,
      questionAudioUrl
    } = await req.json();

    if (!interviewId || !questionId || !answer || !transcript) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get interview and question
    const interview = await prisma.mockInterview.findUnique({
      where: { id: interviewId },
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' }
        }
      }
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const currentQuestion = interview.questions.find(q => q.id === questionId);
    if (!currentQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Check if this question was already answered
    if (currentQuestion.userAnswer) {
      console.warn('Question already answered:', {
        questionId,
        questionNumber: currentQuestion.questionNumber,
        existingAnswer: currentQuestion.userAnswer.substring(0, 50)
      });
      return NextResponse.json(
        { error: 'This question has already been answered' },
        { status: 400 }
      );
    }

    // Analyze voice metrics (basic only, no AI evaluation yet)
    const voiceMetrics = analyzeVoiceMetrics(transcript, speakingDuration);

    // Save answer without evaluation (will be processed in background later)
    await prisma.mockInterviewQuestion.update({
      where: { id: questionId },
      data: {
        userAnswer: answer,
        transcriptRaw: transcript,
        answerAudioUrl: answerAudioUrl || null,
        questionAudioUrl: questionAudioUrl || null,
        speakingDuration,
        wordsPerMinute: voiceMetrics.wordsPerMinute,
        fillerWordCount: voiceMetrics.fillerWordCount,
        pauseCount: voiceMetrics.pauseCount,
        longestPause: voiceMetrics.longestPause,
      },
    });

    console.log('Answer saved successfully:', {
      questionId,
      questionNumber: currentQuestion.questionNumber,
      answerLength: answer.length,
      voiceMetrics
    });

    // Check if this was the last question
    const totalQuestions = interview.questions.length;
    const isLastQuestion = currentQuestion.questionNumber >= totalQuestions;

    console.log('Answer submission complete:', {
      interviewId: interview.id,
      currentQuestionNumber: currentQuestion.questionNumber,
      totalQuestions,
      isLastQuestion
    });

    return NextResponse.json({
      success: true,
      isComplete: isLastQuestion,
      message: isLastQuestion ? 'Interview complete!' : 'Answer saved successfully',
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to process answer' },
      { status: 500 }
    );
  }
}
