import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface PerformanceAnalysis {
  weakTopics: Array<{
    subject: string;
    topic: string;
    accuracy: number;
    attempts: number;
  }>;
  strongTopics: Array<{
    subject: string;
    topic: string;
    accuracy: number;
  }>;
  overallAccuracy: number;
  totalQuestions: number;
  recentTrend: 'improving' | 'declining' | 'stable';
}

interface StudyTask {
  title: string;
  description: string;
  taskType: 'learn' | 'practice' | 'review';
  subject: string;
  topic: string;
  targetCount: number;
  estimatedMinutes: number;
}

export async function generateStudyPlan(
  userId: string,
  attempts: any[],
  errorNotebook: any[]
): Promise<any> {
  // Analyze performance
  const analysis = analyzePerformance(attempts);
  
  // Create prompt for AI
  const prompt = createStudyPlanPrompt(analysis, errorNotebook);
  
  // Generate study plan with Gemini
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  // Parse AI response
  const aiPlan = parseAIResponse(text);
  
  // Calculate week dates
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  
  // Get current week number (or increment)
  const lastPlan = await prisma.studyPlan.findFirst({
    where: { userId },
    orderBy: { weekNumber: 'desc' },
  });
  
  const weekNumber = (lastPlan?.weekNumber || 0) + 1;
  
  // Create study plan in database
  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId,
      planType: 'ai-generated',
      weekNumber,
      startDate,
      endDate,
      focusAreas: JSON.stringify(analysis.weakTopics.slice(0, 5)),
      goals: JSON.stringify(aiPlan.goals || []),
      aiInsights: aiPlan.insights,
      isActive: true,
      totalTaskCount: aiPlan.tasks.length,
      tasks: {
        create: aiPlan.tasks.map((task: StudyTask, index: number) => ({
          title: task.title,
          description: task.description,
          taskType: task.taskType,
          subject: task.subject,
          topic: task.topic,
          targetCount: task.targetCount,
          estimatedMinutes: task.estimatedMinutes,
          orderIndex: index,
        })),
      },
    },
    include: {
      tasks: true,
    },
  });
  
  return studyPlan;
}

export async function generateCustomStudyPlan(
  userId: string,
  topic: string,
  timeframe: number, // days
  depth: 'beginner' | 'intermediate' | 'advanced',
  specificGoals: string[]
): Promise<any> {
  // Create prompt for custom plan
  const prompt = createCustomPlanPrompt(topic, timeframe, depth, specificGoals);
  
  // Generate study plan with Gemini
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  // Parse AI response
  const aiPlan = parseAIResponse(text);
  
  // Calculate dates
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + timeframe);
  
  // Get current week number (or increment)
  const lastPlan = await prisma.studyPlan.findFirst({
    where: { userId },
    orderBy: { weekNumber: 'desc' },
  });
  
  const weekNumber = (lastPlan?.weekNumber || 0) + 1;
  
  // Create study plan in database
  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId,
      planType: 'custom',
      weekNumber,
      startDate,
      endDate,
      focusAreas: JSON.stringify([{ topic, depth }]),
      goals: JSON.stringify(specificGoals.length > 0 ? specificGoals : aiPlan.goals),
      aiInsights: aiPlan.insights,
      customPrompt: `Learn ${topic} at ${depth} level in ${timeframe} days`,
      isActive: true,
      totalTaskCount: aiPlan.tasks.length,
      tasks: {
        create: aiPlan.tasks.map((task: StudyTask, index: number) => ({
          title: task.title,
          description: task.description,
          taskType: task.taskType,
          subject: task.subject || topic,
          topic: task.topic || topic,
          targetCount: task.targetCount,
          estimatedMinutes: task.estimatedMinutes,
          orderIndex: index,
        })),
      },
    },
    include: {
      tasks: true,
    },
  });
  
  return studyPlan;
}

function analyzePerformance(attempts: any[]): PerformanceAnalysis {
  if (attempts.length === 0) {
    return {
      weakTopics: [],
      strongTopics: [],
      overallAccuracy: 0,
      totalQuestions: 0,
      recentTrend: 'stable',
    };
  }
  
  // Calculate overall accuracy
  const correctCount = attempts.filter(a => a.isCorrect).length;
  const overallAccuracy = (correctCount / attempts.length) * 100;
  
  // Group by subject and topic
  const topicStats = new Map<string, {
    subject: string;
    topic: string;
    correct: number;
    total: number;
  }>();
  
  attempts.forEach(attempt => {
    const key = `${attempt.question.subject}:${attempt.question.topic}`;
    const existing = topicStats.get(key) || {
      subject: attempt.question.subject,
      topic: attempt.question.topic,
      correct: 0,
      total: 0,
    };
    
    existing.total++;
    if (attempt.isCorrect) existing.correct++;
    topicStats.set(key, existing);
  });
  
  // Identify weak topics (< 60% accuracy and at least 3 attempts)
  const weakTopics = Array.from(topicStats.values())
    .filter(stat => stat.total >= 3 && (stat.correct / stat.total) < 0.6)
    .map(stat => ({
      subject: stat.subject,
      topic: stat.topic,
      accuracy: Math.round((stat.correct / stat.total) * 100),
      attempts: stat.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
  
  // Identify strong topics (> 80% accuracy and at least 5 attempts)
  const strongTopics = Array.from(topicStats.values())
    .filter(stat => stat.total >= 5 && (stat.correct / stat.total) > 0.8)
    .map(stat => ({
      subject: stat.subject,
      topic: stat.topic,
      accuracy: Math.round((stat.correct / stat.total) * 100),
    }))
    .sort((a, b) => b.accuracy - a.accuracy);
  
  // Calculate recent trend (last 20 vs previous 20)
  const recent = attempts.slice(0, Math.min(20, attempts.length));
  const previous = attempts.slice(20, Math.min(40, attempts.length));
  
  let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (recent.length >= 10 && previous.length >= 10) {
    const recentAccuracy = recent.filter(a => a.isCorrect).length / recent.length;
    const previousAccuracy = previous.filter(a => a.isCorrect).length / previous.length;
    const diff = recentAccuracy - previousAccuracy;
    
    if (diff > 0.1) recentTrend = 'improving';
    else if (diff < -0.1) recentTrend = 'declining';
  }
  
  return {
    weakTopics,
    strongTopics,
    overallAccuracy: Math.round(overallAccuracy),
    totalQuestions: attempts.length,
    recentTrend,
  };
}

function createStudyPlanPrompt(analysis: PerformanceAnalysis, errorNotebook: any[]): string {
  const errorTopics = errorNotebook.slice(0, 5).map(e => ({
    subject: e.question.subject,
    topic: e.question.topic,
    mistakes: e.incorrectCount,
  }));
  
  return `You are an AI Study Coach helping a student prepare for technical interviews. Analyze their performance and create a personalized weekly study plan.

**Student Performance Analysis:**
- Overall Accuracy: ${analysis.overallAccuracy}%
- Total Questions Attempted: ${analysis.totalQuestions}
- Recent Trend: ${analysis.recentTrend}

**Weak Topics (Need Improvement):**
${analysis.weakTopics.length > 0 
  ? analysis.weakTopics.map(t => `- ${t.subject} → ${t.topic}: ${t.accuracy}% (${t.attempts} attempts)`).join('\n')
  : '- No clear weak areas identified yet'}

**Strong Topics (Mastered):**
${analysis.strongTopics.length > 0
  ? analysis.strongTopics.slice(0, 3).map(t => `- ${t.subject} → ${t.topic}: ${t.accuracy}%`).join('\n')
  : '- Keep practicing to build strengths'}

**Recurring Mistakes:**
${errorTopics.length > 0
  ? errorTopics.map(e => `- ${e.subject} → ${e.topic}: ${e.mistakes} mistakes`).join('\n')
  : '- No recurring errors tracked yet'}

**Create a 7-day study plan with the following structure:**

1. **Insights**: Brief analysis of what the student should focus on and why (2-3 sentences)
2. **Goals**: 3-4 specific, measurable goals for the week
3. **Tasks**: 8-12 actionable tasks distributed across the week

**Task Types:**
- **Learn**: Review concepts, understand theory (for topics < 50% accuracy)
- **Practice**: Solve questions (for topics 50-70% accuracy)
- **Review**: Reinforce mastery (for topics > 70% or recurring errors)

**Task Format:**
Each task should include:
- Title: Clear, specific action (e.g., "Master DBMS Normalization Concepts")
- Description: What specifically to do (e.g., "Review 1NF, 2NF, 3NF, BCNF with examples. Focus on identifying functional dependencies.")
- TaskType: "learn", "practice", or "review"
- Subject: The subject name (e.g., "DBMS", "GenAI", "CppOOP", "OS", "PythonML")
- Topic: Specific topic within subject
- TargetCount: Number of questions to practice (10-30 for practice, 5-10 for review, 0 for learn)
- EstimatedMinutes: Time needed (15-45 minutes)

**Important Guidelines:**
- Prioritize weak topics but include some practice on strong topics
- Balance between learning new concepts and practicing
- Start week with learning, end with review
- Make tasks specific and achievable
- Include variety to maintain engagement
${analysis.totalQuestions < 50 ? '- Since the student is new, include more foundational learning tasks' : ''}
${analysis.recentTrend === 'declining' ? '- Include review tasks to reinforce fundamentals' : ''}

**Return ONLY valid JSON in this exact format:**
{
  "insights": "Your analysis here...",
  "goals": [
    "Goal 1: Specific and measurable",
    "Goal 2: Specific and measurable",
    "Goal 3: Specific and measurable"
  ],
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description",
      "taskType": "learn",
      "subject": "SubjectName",
      "topic": "TopicName",
      "targetCount": 0,
      "estimatedMinutes": 30
    }
  ]
}

Generate the study plan now:`;
}

function createCustomPlanPrompt(
  topic: string,
  timeframe: number,
  depth: 'beginner' | 'intermediate' | 'advanced',
  specificGoals: string[]
): string {
  const depthDescriptions = {
    beginner: 'foundational understanding with basic concepts and simple examples',
    intermediate: 'solid grasp with practical applications and common use cases',
    advanced: 'deep expertise with complex scenarios, edge cases, and advanced patterns',
  };

  return `You are an AI Study Coach creating a personalized learning plan for a student.

**Learning Request:**
- Topic: ${topic}
- Timeframe: ${timeframe} days
- Depth Level: ${depth} (${depthDescriptions[depth]})
${specificGoals.length > 0 ? `- Specific Goals:\n${specificGoals.map(g => `  - ${g}`).join('\n')}` : ''}

**Create a ${timeframe}-day study plan covering ${topic} at ${depth} level.**

**Requirements:**
1. **Insights**: Provide a brief overview of what the student will learn and achieve (2-3 sentences)
2. **Goals**: Set 3-4 specific, measurable learning goals appropriate for ${depth} level
3. **Tasks**: Create ${Math.min(12, Math.max(6, Math.ceil(timeframe / 2)))} progressive tasks

**Task Distribution:**
- ${depth === 'beginner' ? '60% learn, 30% practice, 10% review' : depth === 'intermediate' ? '40% learn, 50% practice, 10% review' : '20% learn, 60% practice, 20% review'}
- Progress from basics to advanced concepts
- Include hands-on practice and review sessions
- Distribute workload evenly across ${timeframe} days

**Task Format:**
Each task must include:
- Title: Clear, actionable title (e.g., "Master ${topic} Fundamentals")
- Description: Specific activities and what to focus on
- TaskType: "learn", "practice", or "review"
- Subject: "${topic}"
- Topic: Specific subtopic within ${topic}
- TargetCount: Number of questions/exercises (0 for learn, 10-30 for practice, 5-15 for review)
- EstimatedMinutes: Realistic time estimate (${depth === 'beginner' ? '20-40' : depth === 'intermediate' ? '30-60' : '45-90'} minutes per task)

**Depth-Specific Guidelines:**
${depth === 'beginner' ? '- Start with "what is" and "why" questions\n- Focus on basic syntax, core concepts, and simple examples\n- Include lots of foundational learning before practice\n- Build confidence with easy wins' : ''}
${depth === 'intermediate' ? '- Assume basic knowledge, dive into practical applications\n- Focus on real-world use cases and common patterns\n- Balance theory with hands-on practice\n- Include problem-solving scenarios' : ''}
${depth === 'advanced' ? '- Assume strong foundation, focus on mastery\n- Cover edge cases, performance optimization, advanced patterns\n- Emphasize complex problem-solving and system design\n- Include code reviews and best practices' : ''}

**Return ONLY valid JSON:**
{
  "insights": "Brief overview of the learning journey...",
  "goals": [
    "Goal 1: Specific and measurable",
    "Goal 2: Specific and measurable",
    "Goal 3: Specific and measurable"
  ],
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description",
      "taskType": "learn",
      "subject": "${topic}",
      "topic": "Specific subtopic",
      "targetCount": 0,
      "estimatedMinutes": 30
    }
  ]
}

Generate the custom study plan now:`;
}

function parseAIResponse(text: string): {
  insights: string;
  goals: string[];
  tasks: StudyTask[];
} {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
    
    const parsed = JSON.parse(jsonText);
    
    return {
      insights: parsed.insights || 'Focus on weak areas and consistent practice.',
      goals: parsed.goals || [],
      tasks: parsed.tasks || [],
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('Response text:', text);
    
    // Fallback: create a basic plan
    return {
      insights: 'Continue practicing regularly and focus on understanding concepts deeply.',
      goals: [
        'Complete at least 50 practice questions this week',
        'Review all incorrect answers and understand mistakes',
        'Maintain consistent daily practice schedule',
      ],
      tasks: [
        {
          title: 'Daily Practice Session',
          description: 'Practice 10-15 questions daily across different topics',
          taskType: 'practice',
          subject: 'Mixed',
          topic: 'General Practice',
          targetCount: 70,
          estimatedMinutes: 30,
        },
      ],
    };
  }
}
