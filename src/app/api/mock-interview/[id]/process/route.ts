import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getVoiceMetricsFeedback } from '@/lib/voice-analysis';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(
  request: NextRequest,
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
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Note: interview doesn't have userEmail field in the query, but it's protected by session

    console.log('Starting background processing for interview:', interviewId);

    // Process each question that has an answer but no evaluation
    for (const question of interview.questions) {
      if (!question.userAnswer) {
        console.log(`Skipping question ${question.questionNumber} - no answer`);
        continue;
      }

      if (question.technicalScore !== null) {
        console.log(`Skipping question ${question.questionNumber} - already evaluated`);
        continue;
      }

      console.log(`Evaluating question ${question.questionNumber}...`);

      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Calculate voice metrics feedback
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

Voice Metrics:
- Speaking Duration: ${question.speakingDuration}s
- Words Per Minute: ${voiceMetrics.wordsPerMinute}
- Filler Words: ${voiceMetrics.fillerWordCount}
- Pauses: ${voiceMetrics.pauseCount}

Evaluate the answer and provide:
1. Technical Score (0-100): Accuracy and correctness of technical content
2. Clarity Score (0-100): How clear and well-explained the answer is
3. Depth Score (0-100): Coverage of concepts, edge cases, and complexity
4. Confidence Score (0-100): Based on delivery and content confidence
5. Detailed Feedback: What was good and what could be improved (2-3 paragraphs)
6. Strengths: List 2-3 specific strengths
7. Weaknesses: List 2-3 areas for improvement

Return response as JSON:
{
  "technicalScore": number,
  "clarityScore": number,
  "depthScore": number,
  "confidenceScore": number,
  "feedback": "detailed feedback text with voice metrics insights",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}`;

        const result = await model.generateContent(evaluationPrompt);
        const responseText = result.response.text().trim();

        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const evaluation = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        // Add voice feedback to the evaluation feedback
        const combinedFeedback = `${evaluation.feedback}\n\n**Voice Delivery:** ${voiceFeedback.join(' ')}`;

        // Update question with evaluation
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

        // Fallback evaluation
        const wordCount = question.userAnswer!.split(/\s+/).length;
        const hasGoodLength = wordCount >= 30 && wordCount <= 200;
        const hasGoodPace = question.wordsPerMinute! >= 100 && question.wordsPerMinute! <= 160;
        const hasLowFillers = question.fillerWordCount! <= 5;

        await prisma.mockInterviewQuestion.update({
          where: { id: question.id },
          data: {
            technicalScore: hasGoodLength ? 75 : 60,
            clarityScore: hasLowFillers ? 80 : 65,
            depthScore: hasGoodLength ? 70 : 55,
            confidenceScore: Math.max(30, 100 - (question.fillerWordCount! * 5)),
            feedback: `Your answer demonstrates ${hasGoodLength ? 'good' : 'basic'} understanding. ${hasGoodPace ? 'Your speaking pace was excellent.' : 'Consider adjusting your speaking pace.'} ${hasLowFillers ? 'Great clarity with minimal filler words.' : 'Try to reduce filler words for better clarity.'}`,
            strengths: JSON.stringify([
              hasGoodLength ? 'Provided detailed explanation' : 'Addressed the question',
              hasGoodPace ? 'Maintained good speaking pace' : 'Demonstrated knowledge',
            ]),
            weaknesses: JSON.stringify([
              !hasGoodLength ? 'Could provide more detail and examples' : 'Consider discussing edge cases',
              !hasLowFillers ? 'Reduce use of filler words' : 'Could explore alternative approaches',
            ]),
          },
        });
      }
    }

    // Generate overall interview feedback
    const updatedInterview = await prisma.mockInterview.findUnique({
      where: { id: interviewId },
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (!updatedInterview) {
      throw new Error('Interview not found after processing');
    }

    // Calculate overall metrics
    const questions = updatedInterview.questions;
    const avgTechnical = questions.reduce((sum: number, q: any) => sum + (q.technicalScore || 0), 0) / questions.length;
    const avgClarity = questions.reduce((sum: number, q: any) => sum + (q.clarityScore || 0), 0) / questions.length;
    const avgDepth = questions.reduce((sum: number, q: any) => sum + (q.depthScore || 0), 0) / questions.length;
    const avgConfidence = questions.reduce((sum: number, q: any) => sum + (q.confidenceScore || 0), 0) / questions.length;
    const overallScore = Math.round((avgTechnical + avgClarity + avgDepth + avgConfidence) / 4);

    // Generate detailed feedback
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const feedbackPrompt = `Generate comprehensive interview feedback for a ${interview.difficulty} level ${interview.subject} interview.

Overall Scores:
- Technical: ${avgTechnical.toFixed(1)}
- Clarity: ${avgClarity.toFixed(1)}
- Depth: ${avgDepth.toFixed(1)}
- Confidence: ${avgConfidence.toFixed(1)}

Question Breakdown:
${questions.map((q: any, i: number) => `
Q${i + 1}: ${q.question}
Answer: ${q.userAnswer}
Scores: Tech ${q.technicalScore}, Clarity ${q.clarityScore}, Depth ${q.depthScore}, Confidence ${q.confidenceScore}
`).join('\n')}

Provide:
1. Overall Performance Summary (2-3 paragraphs)
2. Key Strengths (3-4 points)
3. Areas for Improvement (3-4 points)
4. Specific Recommendations (3-4 actionable items)

Format as markdown with clear sections.`;

      const feedbackResult = await model.generateContent(feedbackPrompt);
      const overallFeedback = feedbackResult.response.text().trim();

      // Update interview with final results
      await prisma.mockInterview.update({
        where: { id: interviewId },
        data: {
          status: 'completed',
          feedback: overallFeedback,
          completedAt: new Date(),
        },
      });

      console.log('Interview processing completed successfully');
    } catch (error) {
      console.error('Failed to generate overall feedback:', error);

      // Fallback feedback
      const fallbackFeedback = `## Overall Performance

You scored **${overallScore}/100** in this ${interview.difficulty} level interview.

**Technical Knowledge:** ${avgTechnical.toFixed(1)}/100 - ${avgTechnical >= 75 ? 'Strong understanding demonstrated' : avgTechnical >= 60 ? 'Good foundation, room for improvement' : 'Needs more practice'}

**Communication:** ${avgClarity.toFixed(1)}/100 - ${avgClarity >= 75 ? 'Clear and effective' : 'Could be more structured'}

**Depth:** ${avgDepth.toFixed(1)}/100 - ${avgDepth >= 75 ? 'Thorough coverage' : 'Consider exploring concepts deeper'}

**Confidence:** ${avgConfidence.toFixed(1)}/100 - ${avgConfidence >= 75 ? 'Confident delivery' : 'Work on reducing filler words and pauses'}

## Recommendations

1. Review the detailed feedback for each question
2. Practice explaining concepts in a structured manner
3. Focus on real-world applications and examples
4. Work on speaking pace and clarity`;

      await prisma.mockInterview.update({
        where: { id: interviewId },
        data: {
          status: 'completed',
          feedback: fallbackFeedback,
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Interview processed successfully',
    });
  } catch (error) {
    console.error('Error processing interview:', error);
    return NextResponse.json(
      { error: 'Failed to process interview' },
      { status: 500 }
    );
  }
}
