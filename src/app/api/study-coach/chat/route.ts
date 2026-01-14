import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, context, topic, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build conversation history for context
    const conversationHistory = (history || [])
      .map((msg: any) => `${msg.role === 'user' ? 'Student' : 'Coach'}: ${msg.content}`)
      .join('\n\n');

    // Create comprehensive prompt for teaching
    const prompt = `You are an expert AI Study Coach helping a student learn technical concepts. Your role is to teach, explain, and guide the student's understanding.

**Current Topic:** ${topic || 'General study assistance'}
${context ? `\n**Topic Context:**\n${context}\n` : ''}

**Previous Conversation:**
${conversationHistory || 'This is the start of the conversation.'}

**Student's Question:** ${message}

**Your Teaching Guidelines:**
1. **Explain Clearly**: Break down complex concepts into simple, understandable parts
2. **Use Examples**: Provide real-world examples and analogies when helpful
3. **Be Interactive**: Ask follow-up questions to check understanding
4. **Build on Basics**: Ensure foundational concepts are clear before advancing
5. **Encourage Thinking**: Guide the student to discover answers rather than just telling
6. **Be Supportive**: Create a positive learning environment

**Response Style:**
- Start with a direct answer to their question
- Provide clear explanations with examples
- If concept is complex, break it into steps
- Suggest related concepts they should explore
- Keep responses concise but thorough (aim for 150-200 words)
- Use markdown formatting for clarity:
  - **Bold** for key terms
  - \`code\` for technical terms or syntax
  - Bullet points for lists
  - Numbered steps for procedures

**Topics to Cover (if relevant):**
- Core concepts and definitions
- Practical applications and use cases
- Common pitfalls and how to avoid them
- Best practices
- Related topics for deeper learning

Now, provide your teaching response:`;

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      response: text,
    });
  } catch (error) {
    console.error('Error in study coach chat:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
