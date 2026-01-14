import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

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

    // Get interview with all questions
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

    // Calculate overall scores
    const questions = interview.questions.filter(q => q.userAnswer); // Only answered questions
    
    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No answered questions found' },
        { status: 400 }
      );
    }

    const overallScore = Math.round(
      questions.reduce((sum, q) => {
        const avgScore = (
          (q.technicalScore || 0) +
          (q.clarityScore || 0) +
          (q.depthScore || 0) +
          (q.confidenceScore || 0)
        ) / 4;
        return sum + avgScore;
      }, 0) / questions.length
    );

    const technicalAccuracy = Math.round(
      questions.reduce((sum, q) => sum + (q.technicalScore || 0), 0) / questions.length
    );

    const communicationScore = Math.round(
      questions.reduce((sum, q) => sum + (q.clarityScore || 0), 0) / questions.length
    );

    const depthScore = Math.round(
      questions.reduce((sum, q) => sum + (q.depthScore || 0), 0) / questions.length
    );

    const confidenceScore = Math.round(
      questions.reduce((sum, q) => sum + (q.confidenceScore || 0), 0) / questions.length
    );

    // Calculate voice metrics
    const totalFillerWords = questions.reduce(
      (sum, q) => sum + (q.fillerWordCount || 0), 0
    );
    
    const totalSpeakingTime = questions.reduce(
      (sum, q) => sum + (q.speakingDuration || 0), 0
    );
    
    const avgSpeakingPace = questions.length > 0
      ? questions.reduce((sum, q) => sum + (q.wordsPerMinute || 0), 0) / questions.length
      : 0;
    
    const longestPause = Math.max(
      ...questions.map(q => q.longestPause || 0)
    );

    const duration = Math.floor(
      (new Date().getTime() - new Date(interview.startedAt).getTime()) / 1000
    );

    // Generate overall feedback using AI
    let overallFeedback: string;
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const feedbackPrompt = `You are providing final feedback for a ${interview.difficulty} level technical interview on ${interview.subject}.

Interview Performance Summary:
- Overall Score: ${overallScore}/100
- Technical Accuracy: ${technicalAccuracy}/100
- Communication: ${communicationScore}/100
- Depth of Understanding: ${depthScore}/100
- Confidence: ${confidenceScore}/100

Voice Metrics:
- Average Speaking Pace: ${Math.round(avgSpeakingPace)} WPM
- Total Filler Words: ${totalFillerWords}
- Total Speaking Time: ${Math.floor(totalSpeakingTime / 60)} minutes

Questions and Answers:
${questions.map((q: any, i: number) => `
Question ${i + 1}: ${q.question}
Answer: ${q.userAnswer}
Scores: Technical ${q.technicalScore}, Clarity ${q.clarityScore}, Depth ${q.depthScore}, Confidence ${q.confidenceScore}
`).join('\n')}

Provide comprehensive feedback including:
1. Overall performance summary
2. Key strengths (3-4 points)
3. Areas for improvement (3-4 points)
4. Specific recommendations for growth
5. Topics to study further

Keep the tone professional but encouraging. Be specific and actionable.

Format as plain text with clear sections.`;

      const result = await model.generateContent(feedbackPrompt);
      overallFeedback = result.response.text().trim();
    } catch (feedbackError) {
      console.error('Failed to generate AI feedback, using structured fallback:', feedbackError);
      
      // Generate structured fallback feedback
      const performanceLevel = overallScore >= 80 ? 'excellent' : overallScore >= 70 ? 'strong' : overallScore >= 60 ? 'good' : 'developing';
      const paceQuality = avgSpeakingPace >= 120 && avgSpeakingPace <= 150 ? 'ideal' : avgSpeakingPace > 150 ? 'fast' : 'slow';
      const fillerQuality = totalFillerWords <= 5 ? 'excellent' : totalFillerWords <= 10 ? 'good' : 'needs improvement';
      
      overallFeedback = `
## Overall Performance Summary

You demonstrated ${performanceLevel} performance in this ${interview.difficulty} level ${interview.subject} interview, achieving an overall score of ${overallScore}/100. Your technical knowledge was ${technicalAccuracy >= 75 ? 'solid' : 'developing'}, and your communication style was ${communicationScore >= 75 ? 'clear and effective' : 'adequate'}.

## Key Strengths

${technicalAccuracy >= 75 ? '• Strong technical foundation with accurate explanations\n' : ''}${communicationScore >= 75 ? '• Clear and well-structured communication\n' : ''}${depthScore >= 75 ? '• Demonstrated deep understanding with detailed examples\n' : ''}${confidenceScore >= 75 ? '• Confident delivery with minimal hesitation\n' : ''}${avgSpeakingPace >= 120 && avgSpeakingPace <= 150 ? '• Maintained ideal speaking pace throughout\n' : ''}${totalFillerWords <= 5 ? '• Excellent fluency with minimal filler words\n' : ''}

## Areas for Improvement

${technicalAccuracy < 75 ? '• Strengthen core technical concepts with more practice and study\n' : ''}${depthScore < 75 ? '• Provide more detailed explanations with real-world examples\n' : ''}${totalFillerWords > 10 ? '• Reduce filler words (um, uh, like) - practice pausing instead\n' : ''}${paceQuality === 'fast' ? '• Slow down your speaking pace for better clarity\n' : ''}${paceQuality === 'slow' ? '• Work on maintaining a more natural, flowing speaking pace\n' : ''}${confidenceScore < 75 ? '• Build confidence through more mock interview practice\n' : ''}

## Specific Recommendations

• Review ${interview.subject} fundamentals, especially topics where you seemed less certain
• Practice explaining complex concepts in simple terms
• Record yourself answering questions to identify speech patterns
• Join study groups or find an interview partner for regular practice
• Focus on providing structured answers: context, explanation, example, conclusion

## Topics to Study Further

Based on your responses, consider deepening your knowledge in:
• Advanced ${interview.subject} concepts and design patterns
• Real-world applications and case studies
• Best practices and common pitfalls
• System design and scalability considerations

Keep practicing! Mock interviews are excellent preparation for the real thing.
`;
    }

    // Update interview
    await prisma.mockInterview.update({
      where: { id: interviewId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        duration,
        overallScore,
        technicalAccuracy,
        communicationScore,
        depthScore,
        confidenceScore,
        avgSpeakingPace,
        totalFillerWords,
        totalSpeakingTime,
        longestPause,
      },
    });

    return NextResponse.json({
      success: true,
      results: {
        overallScore,
        technicalAccuracy,
        communicationScore,
        depthScore,
        confidenceScore,
        duration,
        voiceMetrics: {
          avgSpeakingPace: Math.round(avgSpeakingPace),
          totalFillerWords,
          totalSpeakingTime,
          longestPause,
        },
        overallFeedback,
        questionResults: questions.map(q => ({
          number: q.questionNumber,
          question: q.question,
          answer: q.userAnswer,
          scores: {
            technical: q.technicalScore,
            clarity: q.clarityScore,
            depth: q.depthScore,
            confidence: q.confidenceScore,
          },
          feedback: q.feedback,
          strengths: q.strengths ? JSON.parse(q.strengths) : [],
          weaknesses: q.weaknesses ? JSON.parse(q.weaknesses) : [],
          voiceMetrics: {
            wpm: q.wordsPerMinute,
            fillers: q.fillerWordCount,
            duration: q.speakingDuration,
          },
        })),
      },
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    return NextResponse.json(
      { error: 'Failed to complete interview' },
      { status: 500 }
    );
  }
}
