import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all user's question attempts with question details
    const attempts = await prisma.questionAttempt.findMany({
      where: {
        userId: user.id
      },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            topic: true,
            subject: true,
            correctAnswer: true
          }
        }
      },
      orderBy: {
        attemptedAt: 'desc'
      },
      take: 100 // Last 100 attempts
    });

    if (attempts.length === 0) {
      return NextResponse.json({
        success: true,
        insights: {
          hasData: false,
          message: "Start answering questions to see your learning insights!"
        }
      });
    }

    // Analyze patterns
    const incorrectAttempts = attempts.filter(a => !a.isCorrect);
    const topicMistakes = new Map<string, number>();
    const subjectAccuracy = new Map<string, { correct: number; total: number }>();
    const conceptErrors: string[] = [];

    attempts.forEach(attempt => {
      const subject = attempt.question.subject;
      const topic = attempt.question.topic;

      // Track subject accuracy
      if (!subjectAccuracy.has(subject)) {
        subjectAccuracy.set(subject, { correct: 0, total: 0 });
      }
      const subjectStats = subjectAccuracy.get(subject)!;
      subjectStats.total++;
      if (attempt.isCorrect) {
        subjectStats.correct++;
      }

      // Track topic mistakes
      if (!attempt.isCorrect && topic) {
        topicMistakes.set(topic, (topicMistakes.get(topic) || 0) + 1);
      }

      // Collect concept errors
      if (!attempt.isCorrect) {
        conceptErrors.push(`${topic}: ${attempt.question.questionText.substring(0, 100)}`);
      }
    });

    // Find weakest areas
    const weakestTopics = Array.from(topicMistakes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, mistakes]) => ({ topic, mistakes }));

    const weakestSubjects = Array.from(subjectAccuracy.entries())
      .map(([subject, stats]) => ({
        subject,
        accuracy: Math.round((stats.correct / stats.total) * 100),
        correct: stats.correct,
        total: stats.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    // Use AI to generate insights if we have enough data
    let aiInsights: Array<{type: string; insight: string; severity: string}> = [];
    if (incorrectAttempts.length >= 3) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        const prompt = `You are an expert learning analyst. Analyze this student's mistake patterns and provide 3-5 specific, actionable insights.

Student's Learning Data:
- Total attempts: ${attempts.length}
- Incorrect: ${incorrectAttempts.length}
- Accuracy: ${Math.round((attempts.length - incorrectAttempts.length) / attempts.length * 100)}%

Weakest Topics (with mistake counts):
${weakestTopics.map(t => `- ${t.topic}: ${t.mistakes} mistakes`).join('\n')}

Weakest Subjects:
${weakestSubjects.map(s => `- ${s.subject}: ${s.accuracy}% (${s.correct}/${s.total})`).join('\n')}

Recent Concept Errors (sample):
${conceptErrors.slice(0, 10).join('\n')}

Generate insights in this format:
1. Identify specific confusion patterns (e.g., "You confuse 'inheritance' with 'composition' 70% of the time")
2. Point out common mistake types (e.g., "Struggling with ACID property differences")
3. Suggest focus areas (e.g., "Need to review database normalization concepts")
4. Provide motivation (e.g., "Strong improvement in ML concepts over last week!")

Return ONLY a JSON array of insight objects with this structure:
[
  {"type": "confusion", "insight": "You confuse X with Y N% of the time", "severity": "high|medium|low"},
  {"type": "gap", "insight": "Struggling with Z concept", "severity": "high|medium|low"},
  {"type": "focus", "insight": "Review this specific topic", "severity": "medium"},
  {"type": "progress", "insight": "Positive improvement message", "severity": "low"}
]

Limit to 3-5 most important insights. Be specific and actionable.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Extract JSON from response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          aiInsights = JSON.parse(jsonMatch[0]);
        }
      } catch (error) {
        console.error('AI insight generation error:', error);
        // Fallback to rule-based insights
      }
    }

    // Fallback: Generate rule-based insights if AI fails or not enough data
    if (aiInsights.length === 0) {
      const ruleBasedInsights = [];

      // Confusion pattern
      if (weakestTopics.length > 0) {
        const top = weakestTopics[0];
        const percentage = Math.round((top.mistakes / incorrectAttempts.length) * 100);
        ruleBasedInsights.push({
          type: 'confusion',
          insight: `You struggle with "${top.topic}" questions ${percentage}% of the time`,
          severity: percentage > 60 ? 'high' : percentage > 40 ? 'medium' : 'low'
        });
      }

      // Subject weakness
      if (weakestSubjects.length > 0 && weakestSubjects[0].accuracy < 70) {
        ruleBasedInsights.push({
          type: 'gap',
          insight: `${weakestSubjects[0].subject} needs attention - only ${weakestSubjects[0].accuracy}% accuracy`,
          severity: 'high'
        });
      }

      // Focus recommendation
      if (weakestTopics.length > 1) {
        ruleBasedInsights.push({
          type: 'focus',
          insight: `Focus on: ${weakestTopics.slice(0, 3).map(t => t.topic).join(', ')}`,
          severity: 'medium'
        });
      }

      // Progress motivation
      const recentAttempts = attempts.slice(0, 20);
      const recentCorrect = recentAttempts.filter(a => a.isCorrect).length;
      const recentAccuracy = Math.round((recentCorrect / recentAttempts.length) * 100);
      if (recentAccuracy > 60) {
        ruleBasedInsights.push({
          type: 'progress',
          insight: `Recent performance: ${recentAccuracy}% accuracy in last ${recentAttempts.length} questions!`,
          severity: 'low'
        });
      }

      aiInsights = ruleBasedInsights;
    }

    // Calculate overall stats
    const totalAnswered = attempts.length;
    const totalCorrect = attempts.filter(a => a.isCorrect).length;
    const overallAccuracy = Math.round((totalCorrect / totalAnswered) * 100);

    return NextResponse.json({
      success: true,
      insights: {
        hasData: true,
        aiInsights,
        stats: {
          totalAnswered,
          totalCorrect,
          overallAccuracy,
          totalIncorrect: totalAnswered - totalCorrect
        },
        weakestTopics: weakestTopics.slice(0, 3),
        weakestSubjects: weakestSubjects.slice(0, 2),
        resources: [
          {
            topic: weakestTopics[0]?.topic || 'Core Concepts',
            suggestions: [
              'Review fundamentals',
              'Practice similar questions',
              'Use AI tutor for clarification'
            ]
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error generating learning insights:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
