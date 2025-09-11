import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, question, correctAnswer, rationale, level } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!question || !correctAnswer || !rationale || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let promptSuffix = '';
    switch (level) {
      case 'simple':
        promptSuffix = 'Explain this like I\'m a beginner. Use simple terms and avoid jargon.';
        break;
      case 'detailed':
        promptSuffix = 'Provide a detailed explanation with examples and context.';
        break;
      case 'advanced':
        promptSuffix = 'Give an advanced, technical explanation with deeper insights.';
        break;
      default:
        promptSuffix = 'Provide a clear explanation.';
    }

    const prompt = `Question: ${question}
Correct Answer: ${correctAnswer}
Explanation: ${rationale}

${promptSuffix}

Please provide a comprehensive explanation of why this answer is correct and help me understand the underlying concepts.`;

    // Retry logic for overloaded API
    let result;
    let text;
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        break; // Success, exit retry loop
      } catch (retryError: any) {
        retryCount++;
        
        if (retryError.status === 503 && retryCount < maxRetries) {
          // Wait before retrying (exponential backoff)
          const waitTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
          console.log(`API overloaded, retrying in ${waitTime}ms... (attempt ${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // If it's the last retry or not a 503 error, throw it
        throw retryError;
      }
    }

    // Ensure we have a response
    if (!text) {
      throw new Error('No response received from AI model');
    }

    return NextResponse.json({ 
      success: true, 
      explanation: text,
      level: level 
    });

  } catch (error: any) {
    console.error('Error generating explanation:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('API_KEY_INVALID')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Gemini API key.' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('QUOTA_EXCEEDED')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.status === 503 || error.message?.includes('overloaded')) {
      return NextResponse.json(
        { error: 'AI service is currently overloaded. Please try again in a few moments.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate explanation. Please try again.' },
      { status: 500 }
    );
  }
}
