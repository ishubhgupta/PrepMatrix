import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Detect if message is a follow-up or clarification request
function isFollowUp(message: string): boolean {
  const followUpPatterns = [
    /i don'?t understand/i,
    /what do you mean/i,
    /can you explain/i,
    /explain again/i,
    /explain (?:it )?(?:more |differently|simpler)/i,
    /could you clarify/i,
    /still confused/i,
    /more detail/i,
    /break it down/i,
    /simplify/i,
    /eli5/i, // Explain like I'm 5
  ];
  
  return followUpPatterns.some(pattern => pattern.test(message));
}

// Detect complexity level of user's question
function detectComplexity(message: string): string {
  const advancedKeywords = ['architecture', 'optimization', 'algorithm', 'complexity', 'performance', 'scalability', 'distributed', 'concurrent'];
  const intermediateKeywords = ['implement', 'difference between', 'how does', 'why is', 'when to use'];
  const beginnerKeywords = ['what is', 'what are', 'basic', 'simple', 'introduction', 'beginner', 'start'];
  
  const lowerMessage = message.toLowerCase();
  
  if (advancedKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'advanced';
  } else if (intermediateKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'intermediate';
  } else if (beginnerKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'beginner';
  }
  
  return 'intermediate'; // Default
}

// Detect topic from message
function detectTopic(message: string): string | null {
  const topicKeywords = {
    'GenAI': ['generative ai', 'llm', 'transformer', 'gpt', 'bert', 'attention mechanism', 'neural network', 'machine learning', 'deep learning'],
    'DBMS': ['database', 'sql', 'nosql', 'normalization', 'acid', 'transaction', 'index', 'query', 'relational'],
    'OS': ['operating system', 'process', 'thread', 'scheduling', 'memory management', 'deadlock', 'semaphore', 'virtual memory'],
    'CppOOP': ['c++', 'cpp', 'oop', 'object oriented', 'class', 'inheritance', 'polymorphism', 'encapsulation', 'virtual function'],
    'PythonML': ['python', 'pandas', 'numpy', 'scikit', 'matplotlib', 'data science', 'ml', 'machine learning'],
  };
  
  const lowerMessage = message.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return topic;
    }
  }
  
  return null;
}

// Get or create user learning profile
async function getUserProfile(userId: string) {
  let profile = await prisma.userLearningProfile.findUnique({
    where: { userId },
  });
  
  if (!profile) {
    profile = await prisma.userLearningProfile.create({
      data: { userId },
    });
  }
  
  return profile;
}

// Update learning profile based on interaction
async function updateLearningProfile(
  userId: string,
  isFollowUp: boolean,
  topic: string | null,
  complexity: string
) {
  const profile = await getUserProfile(userId);
  
  // Update total interactions
  const totalInteractions = profile.totalInteractions + 1;
  
  // Update follow-up average
  const avgFollowUpsPerTopic = 
    (profile.avgFollowUpsPerTopic * profile.totalInteractions + (isFollowUp ? 1 : 0)) / totalInteractions;
  
  // Update comprehension indicator (lower if many follow-ups)
  const comprehensionIndicator = Math.max(0, Math.min(1, 
    profile.comprehensionIndicator + (isFollowUp ? -0.05 : 0.02)
  ));
  
  // Determine learning pace based on follow-ups and comprehension
  let learningPace = profile.learningPace;
  if (avgFollowUpsPerTopic > 2.0 || comprehensionIndicator < 0.4) {
    learningPace = 'slow';
  } else if (avgFollowUpsPerTopic < 1.0 && comprehensionIndicator > 0.7) {
    learningPace = 'fast';
  } else {
    learningPace = 'medium';
  }
  
  // Update preferred style based on complexity
  let preferredStyle = profile.preferredStyle;
  if (complexity === 'beginner' && learningPace === 'slow') {
    preferredStyle = 'simple';
  } else if (complexity === 'advanced' && learningPace === 'fast') {
    preferredStyle = 'technical';
  } else {
    preferredStyle = 'balanced';
  }
  
  // Update frequent topics
  let frequentTopics: string[] = [];
  if (profile.frequentTopics) {
    try {
      frequentTopics = JSON.parse(profile.frequentTopics);
    } catch (e) {
      frequentTopics = [];
    }
  }
  
  if (topic && !frequentTopics.includes(topic)) {
    frequentTopics.push(topic);
    if (frequentTopics.length > 5) {
      frequentTopics = frequentTopics.slice(-5); // Keep last 5
    }
  }
  
  await prisma.userLearningProfile.update({
    where: { userId },
    data: {
      totalInteractions,
      avgFollowUpsPerTopic,
      comprehensionIndicator,
      learningPace,
      preferredStyle,
      frequentTopics: JSON.stringify(frequentTopics),
      lastInteractionAt: new Date(),
    },
  });
  
  return {
    ...profile,
    learningPace,
    preferredStyle,
    comprehensionIndicator,
  };
}

// Build adaptive prompt based on user profile
function buildAdaptivePrompt(
  message: string,
  profile: any,
  recentHistory: any[],
  isFollowUp: boolean
) {
  const { learningPace, preferredStyle, comprehensionIndicator } = profile;
  
  let systemPrompt = `You are an adaptive AI tutor that adjusts teaching style based on student's learning patterns.

**Student Learning Profile:**
- Learning Pace: ${learningPace} (${
    learningPace === 'slow' ? 'needs more time and detailed explanations' :
    learningPace === 'fast' ? 'grasps concepts quickly, prefers concise answers' :
    'balanced pace'
  })
- Preferred Style: ${preferredStyle} (${
    preferredStyle === 'simple' ? 'simple language with many examples' :
    preferredStyle === 'technical' ? 'technical depth and advanced concepts' :
    'balanced mix of theory and practice'
  })
- Comprehension Level: ${Math.round(comprehensionIndicator * 100)}% (${
    comprehensionIndicator < 0.4 ? 'frequently needs clarification' :
    comprehensionIndicator > 0.7 ? 'understands well on first explanation' :
    'moderate comprehension'
  })
`;

  // Add adaptive teaching instructions
  if (learningPace === 'slow' || preferredStyle === 'simple') {
    systemPrompt += `\n**Teaching Approach for This Student:**
- Use SIMPLE, everyday language
- Break down concepts into small, digestible steps
- Provide MULTIPLE analogies and real-world examples
- Use numbered lists for clarity
- Include visual descriptions (e.g., "imagine a..." or "think of it like...")
- Avoid jargon unless you explain it immediately
- Repeat key points in different ways
- Ask rhetorical questions to guide thinking
- Use shorter sentences and paragraphs
`;
  } else if (learningPace === 'fast' || preferredStyle === 'technical') {
    systemPrompt += `\n**Teaching Approach for This Student:**
- Be concise and to-the-point
- Use technical terminology (they can handle it)
- Go deeper into underlying concepts and theory
- Provide advanced insights and edge cases
- Include performance considerations and best practices
- Skip basic explanations unless asked
- Challenge them with thought-provoking questions
`;
  } else {
    systemPrompt += `\n**Teaching Approach for This Student:**
- Balance theory with practical examples
- Use clear language but don't oversimplify
- Provide code examples when relevant
- Include 2-3 key points per concept
- Mix analogies with technical explanations
`;
  }
  
  // Add context for follow-up questions
  if (isFollowUp) {
    systemPrompt += `\n**IMPORTANT**: This is a FOLLOW-UP question, meaning the student didn't fully understand your previous explanation. You MUST:
1. Apologize briefly ("Let me explain this differently...")
2. Use a COMPLETELY DIFFERENT approach (new analogy, different example)
3. Be even MORE SIMPLE and CLEARER than before
4. Break it down into smaller pieces
5. Check understanding at the end ("Does this make more sense now?")
`;
  }
  
  systemPrompt += `\n**Response Format:**
- Use markdown formatting (bold for key terms, bullet points for lists)
- Keep responses ${learningPace === 'slow' ? '250-350' : learningPace === 'fast' ? '150-200' : '200-250'} words
- Always end with an encouraging note or question to engage further
- Be friendly, patient, and encouraging

Now respond to the student's question:`;

  return systemPrompt;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Analyze the message
    const isFollowUpQuestion = isFollowUp(message);
    const complexity = detectComplexity(message);
    const topic = detectTopic(message);

    // Get user's learning profile
    const profile = await getUserProfile(user.id);

    // Get recent conversation history (last 6 messages)
    const recentHistory = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
        sessionId: sessionId || undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    // Build conversation context
    const conversationContext = recentHistory
      .reverse()
      .map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
      .join('\n');

    // Save user message
    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        role: 'user',
        content: message,
        topic,
        complexity,
        isFollowUp: isFollowUpQuestion,
        sessionId: sessionId || null,
      },
    });

    // Build adaptive prompt
    const systemPrompt = buildAdaptivePrompt(message, profile, recentHistory, isFollowUpQuestion);

    // Generate AI response
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const startTime = Date.now();

    const fullPrompt = `${systemPrompt}

${conversationContext ? `**Recent Conversation:**\n${conversationContext}\n\n` : ''}**Current Question:** ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();
    const responseTime = Date.now() - startTime;

    // Save assistant response
    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        role: 'assistant',
        content: response,
        topic,
        complexity,
        sessionId: sessionId || null,
        responseTime,
      },
    });

    // Update learning profile
    await updateLearningProfile(user.id, isFollowUpQuestion, topic, complexity);

    return NextResponse.json({
      response,
      learningProfile: {
        pace: profile.learningPace,
        style: profile.preferredStyle,
      },
    });
  } catch (error) {
    console.error('Adaptive chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
