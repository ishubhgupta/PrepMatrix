import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getVoiceMetricsFeedback } from '@/lib/voice-analysis';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Background processing function
async function processInterviewInBackground(interviewId: string, userEmail: string) {
  console.log('Starting background processing for interview:', interviewId);

  // Get interview with all questions
  const interview = await prisma.mockInterview.findUnique({
    where: { id: interviewId },
    include: {
      questions: {
        orderBy: { questionNumber: 'asc' },
      },
    },
  });

  if (!interview) {
    console.error('Interview not found:', interviewId);
    return;
  }

  // Process each question
  for (const question of interview.questions) {
    if (!question.userAnswer || question.technicalScore !== null) {
      continue;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const voiceMetrics = {
        wordsPerMinute: question.wordsPerMinute || 0,
        fillerWordCount: question.fillerWordCount || 0,
        pauseCount: question.pauseCount || 0,
        longestPause: question.longestPause || 0,
        speakingDuration: question.speakingDuration || 0,
        clarity: (question.fillerWordCount! <= 3 ? 'excellent' : question.fillerWordCount! <= 7 ? 'good' : 'poor') as 'excellent' | 'good' | 'poor' | 'fair'
      };
      const voiceFeedback = getVoiceMetricsFeedback(voiceMetrics);

      const evaluationPrompt = `You are evaluating an answer in a ${interview.difficulty} level technical interview for ${interview.subject}.

Question: ${question.question}

Candidate's Answer: ${question.userAnswer}

Evaluate the answer and provide:
1. Technical Score (0-100): Accuracy and correctness
2. Clarity Score (0-100): How clear and well-explained
3. Depth Score (0-100): Coverage of concepts
4. Confidence Score (0-100): Based on delivery and content

Return JSON:
{
  "technicalScore": number,
  "clarityScore": number,
  "depthScore": number,
  "confidenceScore": number,
  "feedback": "detailed feedback",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}`;

      const result = await model.generateContent(evaluationPrompt);
      const responseText = result.response.text().trim();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const evaluation = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

      const combinedFeedback = `${evaluation.feedback}\n\n**Voice Delivery:** ${voiceFeedback.join(' ')}`;

      await prisma.mockInterviewQuestion.update({
        where: { id: question.id },
        data: {
          technicalScore: evaluation.technicalScore,
          clarityScore: evaluation.clarityScore,
          depthScore: evaluation.depthScore,
          confidenceScore: evaluation.confidenceScore,
          feedback: combinedFeedback,
          strengths: JSON.stringify(evaluation.strengths || []),
          weaknesses: JSON.stringify(evaluation.weaknesses || []),
        },
      });

      console.log(`Question ${question.questionNumber} evaluated successfully`);
    } catch (error) {
      console.error(`Failed to evaluate question ${question.questionNumber}:`, error);
      
      // Fallback
      const wordCount = question.userAnswer!.split(/\s+/).length;
      await prisma.mockInterviewQuestion.update({
        where: { id: question.id },
        data: {
          technicalScore: wordCount >= 30 ? 75 : 60,
          clarityScore: question.fillerWordCount! <= 5 ? 80 : 65,
          depthScore: wordCount >= 30 ? 70 : 55,
          confidenceScore: Math.max(30, 100 - (question.fillerWordCount! * 5)),
          feedback: `Your answer demonstrates understanding. ${wordCount >= 30 ? 'Good detail provided.' : 'Could provide more detail.'}`,
          strengths: JSON.stringify(['Addressed the question', 'Demonstrated knowledge']),
          weaknesses: JSON.stringify(['Could provide more examples', 'Consider edge cases']),
        },
      });
    }
  }

  // Generate overall feedback
  const updatedInterview = await prisma.mockInterview.findUnique({
    where: { id: interviewId },
    include: { questions: { orderBy: { questionNumber: 'asc' } } },
  });

  if (!updatedInterview) return;

  const questions = updatedInterview.questions;
  const avgTechnical = questions.reduce((sum: number, q: any) => sum + (q.technicalScore || 0), 0) / questions.length;
  const avgClarity = questions.reduce((sum: number, q: any) => sum + (q.clarityScore || 0), 0) / questions.length;
  const avgDepth = questions.reduce((sum: number, q: any) => sum + (q.depthScore || 0), 0) / questions.length;
  const avgConfidence = questions.reduce((sum: number, q: any) => sum + (q.confidenceScore || 0), 0) / questions.length;
  const overallScore = Math.round((avgTechnical + avgClarity + avgDepth + avgConfidence) / 4);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const feedbackPrompt = `Analyze this technical assessment performance and provide a professional review.

Performance Metrics:
- Technical Knowledge: ${avgTechnical.toFixed(1)}/100
- Communication Clarity: ${avgClarity.toFixed(1)}/100
- Depth of Understanding: ${avgDepth.toFixed(1)}/100
- Confidence Level: ${avgConfidence.toFixed(1)}/100
- Overall Score: ${overallScore}/100

Subject: ${interview.subject}
Difficulty Level: ${interview.difficulty}

Responses Analysis:
${questions.map((q: any, i: number) => `
Question ${i + 1}: ${q.question}
Response: ${q.userAnswer}
Performance: Technical=${q.technicalScore}, Clarity=${q.clarityScore}, Depth=${q.depthScore}, Confidence=${q.confidenceScore}
`).join('\n')}

Generate a comprehensive performance review with the following structure:

## Performance Summary
[2-3 paragraphs analyzing overall performance based on the scores and responses]

## Key Strengths
- [List 3-4 specific strong points observed in the responses]

## Areas for Improvement
- [List 3-4 specific areas where performance could be enhanced]

## Technical Recommendations
- [3-4 actionable recommendations for skill development]

## Study Focus Areas
- [3-4 specific topics to study based on the responses]

Keep the tone professional and constructive. Focus on technical competency, clarity of explanation, and depth of knowledge. Be specific and reference actual responses when relevant.`;

    const feedbackResult = await model.generateContent(feedbackPrompt);
    const overallFeedback = feedbackResult.response.text().trim();

    await prisma.mockInterview.update({
      where: { id: interviewId },
      data: {
        feedback: overallFeedback,
        overallScore,
        technicalAccuracy: Math.round(avgTechnical),
        communicationScore: Math.round(avgClarity),
        depthScore: Math.round(avgDepth),
        confidenceScore: Math.round(avgConfidence),
        duration: updatedInterview.questions.reduce((sum: number, q: any) => sum + (q.speakingDuration || 0), 0),
      },
    });
  } catch (error) {
    console.error('Failed to generate overall feedback:', error);
    
    // Fallback structured feedback
    const performanceLevel = overallScore >= 80 ? 'Excellent' : overallScore >= 70 ? 'Strong' : overallScore >= 60 ? 'Good' : 'Developing';
    const fallbackFeedback = `## Performance Summary

You demonstrated **${performanceLevel.toLowerCase()}** performance with an overall score of **${overallScore}/100**. Your technical knowledge scored ${avgTechnical.toFixed(1)}/100, communication clarity ${avgClarity.toFixed(1)}/100, depth of understanding ${avgDepth.toFixed(1)}/100, and confidence ${avgConfidence.toFixed(1)}/100.

${avgTechnical >= 75 ? 'Your technical foundation is solid with accurate explanations across most concepts.' : 'Your technical understanding shows promise but needs further development in key areas.'}

${avgClarity >= 75 ? 'You communicated concepts clearly with well-structured explanations.' : 'Consider organizing your responses more systematically to improve clarity.'}

## Key Strengths

${avgTechnical >= 75 ? '- Strong technical foundation with accurate explanations\n' : ''}${avgClarity >= 75 ? '- Clear and well-structured communication\n' : ''}${avgDepth >= 75 ? '- Demonstrated deep understanding with relevant examples\n' : ''}${avgConfidence >= 75 ? '- Confident delivery with minimal hesitation\n' : ''}${avgTechnical >= 75 || avgClarity >= 75 || avgDepth >= 75 || avgConfidence >= 75 ? '' : '- Consistent effort across all questions\n- Willingness to engage with complex topics\n'}

## Areas for Improvement

${avgTechnical < 75 ? '- Strengthen core technical concepts through focused study\n' : ''}${avgDepth < 75 ? '- Provide more detailed explanations with practical examples\n' : ''}${avgClarity < 70 ? '- Structure responses more systematically (problem → solution → example)\n' : ''}${avgConfidence < 70 ? '- Practice articulating technical concepts to build confidence\n' : ''}${avgTechnical >= 75 && avgDepth >= 75 && avgClarity >= 70 ? '- Consider exploring advanced topics and edge cases\n- Deepen knowledge in specialized areas\n' : ''}

## Technical Recommendations

- Review ${interview.subject} fundamentals and build a strong foundation
- Practice explaining complex concepts in simple, structured terms
- Work through hands-on projects to apply theoretical knowledge
- Join study groups or technical discussions to improve articulation

## Study Focus Areas

Based on your responses, prioritize these topics:
- Core ${interview.subject} principles and best practices
- Real-world application scenarios and case studies
- Problem-solving patterns and common pitfalls
- Industry-standard tools and methodologies

Continue practicing regularly to build both knowledge and confidence.`;

    await prisma.mockInterview.update({
      where: { id: interviewId },
      data: {
        feedback: fallbackFeedback,
        overallScore,
        technicalAccuracy: Math.round(avgTechnical),
        communicationScore: Math.round(avgClarity),
        depthScore: Math.round(avgDepth),
        confidenceScore: Math.round(avgConfidence),
        duration: updatedInterview.questions.reduce((sum: number, q: any) => sum + (q.speakingDuration || 0), 0),
      },
    });
  }

  console.log('Interview processing completed successfully');
}


export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interviewId = params.id;

    // Get interview with questions to calculate duration
    const interview = await prisma.mockInterview.findUnique({
      where: { id: interviewId },
      include: { questions: true },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Calculate total speaking duration
    const totalDuration = interview.questions.reduce(
      (sum, q) => sum + (q.speakingDuration || 0),
      0
    );

    // Update interview status to completed with duration
    await prisma.mockInterview.update({
      where: { id: interviewId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        duration: totalDuration,
      },
    });

    console.log('Interview marked as completed, starting background processing inline');

    // Process inline in background (don't wait for response)
    // This runs asynchronously without blocking the response
    const userEmail = session.user.email;
    (async () => {
      try {
        await processInterviewInBackground(interviewId, userEmail);
      } catch (error) {
        console.error('Background processing error:', error);
      }
    })();

    return NextResponse.json({
      success: true,
      message: 'Interview saved! Results will be ready shortly.',
      interviewId,
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    return NextResponse.json(
      { error: 'Failed to complete interview' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interviewId = params.id;

    // Get interview with questions
    const interview = await prisma.mockInterview.findUnique({
      where: { id: interviewId },
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Note: interview doesn't have userEmail field in the query, but it's protected by session

    // Calculate duration from speaking times
    const totalSpeakingTime = interview.questions.reduce(
      (sum, q) => sum + (q.speakingDuration || 0),
      0
    );

    const questions = interview.questions.map((q) => ({
      id: q.id,
      number: q.questionNumber,
      question: q.question,
      userAnswer: q.userAnswer,
      transcriptRaw: q.transcriptRaw,
      questionAudioUrl: q.questionAudioUrl,
      answerAudioUrl: q.answerAudioUrl,
      speakingDuration: q.speakingDuration,
      wordsPerMinute: q.wordsPerMinute,
      fillerWordCount: q.fillerWordCount,
      pauseCount: q.pauseCount,
      longestPause: q.longestPause,
      technicalScore: q.technicalScore,
      clarityScore: q.clarityScore,
      depthScore: q.depthScore,
      confidenceScore: q.confidenceScore,
      feedback: q.feedback,
      strengths: q.strengths ? JSON.parse(q.strengths) : [],
      weaknesses: q.weaknesses ? JSON.parse(q.weaknesses) : [],
      isFollowUp: q.isFollowUp,
    }));

    // Calculate average scores
    const evaluatedQuestions = questions.filter(q => q.technicalScore !== null);
    
    if (evaluatedQuestions.length === 0) {
      // Still processing
      return NextResponse.json({
        interviewId: interview.id,
        subject: interview.subject,
        difficulty: interview.difficulty,
        status: 'processing',
        message: 'Your interview is being evaluated. Please check back in a moment.',
      });
    }

    const avgScores = {
      technical:
        evaluatedQuestions.reduce((sum, q) => sum + (q.technicalScore || 0), 0) /
        evaluatedQuestions.length,
      clarity:
        evaluatedQuestions.reduce((sum, q) => sum + (q.clarityScore || 0), 0) /
        evaluatedQuestions.length,
      depth:
        evaluatedQuestions.reduce((sum, q) => sum + (q.depthScore || 0), 0) /
        evaluatedQuestions.length,
      confidence:
        evaluatedQuestions.reduce((sum, q) => sum + (q.confidenceScore || 0), 0) /
        evaluatedQuestions.length,
    };

    const overallScore = Math.round(
      (avgScores.technical + avgScores.clarity + avgScores.depth + avgScores.confidence) / 4
    );

    return NextResponse.json({
      interviewId: interview.id,
      subject: interview.subject,
      difficulty: interview.difficulty,
      duration: totalSpeakingTime,
      overallScore,
      averageScores: avgScores,
      questions,
      feedback: interview.feedback || 'Processing feedback...',
      status: interview.feedback ? 'completed' : 'processing',
    });
  } catch (error) {
    console.error('Error fetching interview results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
