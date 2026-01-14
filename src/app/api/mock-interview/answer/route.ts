import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { analyzeVoiceMetrics, getVoiceMetricsFeedback } from '@/lib/voice-analysis';

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

    const { 
      interviewId, 
      questionId, 
      answer, 
      transcript,
      speakingDuration 
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

    // Analyze voice metrics
    const voiceMetrics = analyzeVoiceMetrics(transcript, speakingDuration);
    const voiceFeedback = getVoiceMetricsFeedback(voiceMetrics);

    // Evaluate answer using AI
    let evaluation: any;
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const evaluationPrompt = `You are evaluating an answer in a ${interview.difficulty} level technical interview for ${interview.subject}.

Question: ${currentQuestion.question}

Candidate's Answer: ${answer}

Evaluate the answer and provide:
1. Technical Score (0-100): Accuracy and correctness of technical content
2. Clarity Score (0-100): How clear and well-explained the answer is
3. Depth Score (0-100): Coverage of concepts, edge cases, and complexity
4. Confidence Score (0-100): Based on the delivery (we detected ${voiceMetrics.fillerWordCount} filler words, ${voiceMetrics.wordsPerMinute} WPM)
5. Detailed Feedback: What was good and what could be improved
6. Strengths: List 2-3 specific strengths
7. Weaknesses: List 2-3 areas for improvement

Return response as JSON:
{
  "technicalScore": number,
  "clarityScore": number,
  "depthScore": number,
  "confidenceScore": number,
  "feedback": "detailed feedback text",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "shouldAskFollowUp": boolean,
  "followUpQuestion": "optional follow-up question if needed"
}`;

      const result = await model.generateContent(evaluationPrompt);
      const responseText = result.response.text().trim();
      
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      evaluation = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (e) {
      console.error('AI evaluation failed, using fallback scoring:', e);
      
      // Calculate basic scores based on answer length and voice metrics
      const wordCount = answer.split(/\s+/).length;
      const hasGoodLength = wordCount >= 30 && wordCount <= 200;
      const hasGoodPace = voiceMetrics.wordsPerMinute >= 100 && voiceMetrics.wordsPerMinute <= 160;
      const hasLowFillers = voiceMetrics.fillerWordCount <= 5;
      
      // Fallback to basic scores
      evaluation = {
        technicalScore: hasGoodLength ? 75 : 60,
        clarityScore: voiceMetrics.clarity === 'excellent' ? 90 : voiceMetrics.clarity === 'good' ? 75 : 60,
        depthScore: hasGoodLength ? 70 : 55,
        confidenceScore: Math.max(30, 100 - (voiceMetrics.fillerWordCount * 5)),
        feedback: `Your answer demonstrates ${hasGoodLength ? 'good' : 'basic'} understanding. ${voiceFeedback.join(' ')} ${hasGoodPace ? 'Your speaking pace was excellent.' : ''} ${hasLowFillers ? 'Great clarity with minimal filler words.' : 'Try to reduce filler words for better clarity.'}`,
        strengths: [
          hasGoodLength ? 'Provided detailed explanation' : 'Addressed the question',
          hasGoodPace ? 'Maintained good speaking pace' : 'Demonstrated knowledge',
        ],
        weaknesses: [
          !hasGoodLength ? 'Could provide more detail and examples' : 'Consider discussing edge cases',
          !hasLowFillers ? 'Reduce use of filler words' : 'Could explore alternative approaches',
        ],
        shouldAskFollowUp: false,
      };
    }

    // Update question with answer and evaluation
    await prisma.mockInterviewQuestion.update({
      where: { id: questionId },
      data: {
        userAnswer: answer,
        transcriptRaw: transcript,
        speakingDuration,
        wordsPerMinute: voiceMetrics.wordsPerMinute,
        fillerWordCount: voiceMetrics.fillerWordCount,
        pauseCount: voiceMetrics.pauseCount,
        longestPause: voiceMetrics.longestPause,
        technicalScore: evaluation.technicalScore,
        clarityScore: evaluation.clarityScore,
        depthScore: evaluation.depthScore,
        confidenceScore: evaluation.confidenceScore,
        feedback: evaluation.feedback,
        strengths: JSON.stringify(evaluation.strengths || []),
        weaknesses: JSON.stringify(evaluation.weaknesses || []),
      },
    });

    // Check if we should generate next question
    let nextQuestion = null;
    const totalQuestions = interview.questions.length;
    const shouldContinue = totalQuestions < 5; // Limit to 5 questions per interview

    if (shouldContinue) {
      // Generate next question
      const nextQuestionNumber = totalQuestions + 1;
      const isFollowUp = evaluation.shouldAskFollowUp && evaluation.followUpQuestion;

      let nextQuestionText;
      if (isFollowUp) {
        nextQuestionText = evaluation.followUpQuestion;
      } else {
        // Generate new main question with specific diverse topic
        try {
          const allPreviousQuestions = interview.questions.map((q: any) => q.question).join('\n- ');
          
          // Get a list of diverse topics and pick one not covered
          const topicList = getTopicsForSubject(interview.subject);
          const topicForThisQuestion = topicList[nextQuestionNumber - 1] || `a different aspect of ${interview.subject}`;
          
          const nextQuestionPrompt = `You are conducting a ${interview.difficulty} level technical interview for ${interview.subject}.

This is question #${nextQuestionNumber} of the interview.

PREVIOUS QUESTIONS ALREADY ASKED:
- ${allPreviousQuestions}

YOU MUST generate a question about a DIFFERENT TOPIC: ${topicForThisQuestion}

Generate a question specifically about "${topicForThisQuestion}". The question MUST:
1. Focus ONLY on ${topicForThisQuestion} - NOT on any topics from previous questions
2. Be COMPLETELY DIFFERENT from all previous questions
3. Be appropriate for ${interview.difficulty} level
4. Test practical knowledge and application

CRITICAL: This question should explore ${topicForThisQuestion} and must be entirely different from questions already asked above.

Return ONLY the new question text, nothing else.`;

          const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
          const nextQuestionResult = await model.generateContent(nextQuestionPrompt);
          nextQuestionText = nextQuestionResult.response.text().trim();
        } catch (qError) {
          console.error('Failed to generate next question, using fallback:', qError);
          nextQuestionText = `Can you explain a practical scenario where you would apply ${interview.subject} concepts? What challenges might you face?`;
        }
      }

      // Save next question
      const newQuestion = await prisma.mockInterviewQuestion.create({
        data: {
          interviewId: interview.id,
          questionNumber: nextQuestionNumber,
          question: nextQuestionText,
          isFollowUp,
          parentQuestionId: isFollowUp ? questionId : null,
        },
      });

      nextQuestion = {
        id: newQuestion.id,
        number: newQuestion.questionNumber,
        text: nextQuestionText,
        isFollowUp,
      };
    }

    return NextResponse.json({
      success: true,
      nextQuestion,
      interviewComplete: !shouldContinue,
      // Don't send evaluation details until interview is complete
      savedSuccessfully: true,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to process answer' },
      { status: 500 }
    );
  }
}
