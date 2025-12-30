import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { question, correctAnswer, rationale, level } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    if (!question || !correctAnswer || !rationale || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let promptSuffix = '';
    switch (level) {
      case 'simple':
        promptSuffix = 'Explain this like I\'m a beginner. Use simple terms and avoid jargon. Keep it under 150 words.';
        break;
      case 'detailed':
        promptSuffix = 'Provide a clear explanation with key points. Keep it under 200 words.';
        break;
      case 'advanced':
        promptSuffix = 'Give a technical explanation with deeper insights. Keep it under 200 words.';
        break;
      default:
        promptSuffix = 'Provide a clear, concise explanation in under 150 words.';
    }

    const prompt = `Question: ${question}
Correct Answer: ${correctAnswer}
Explanation: ${rationale}

${promptSuffix}

Provide a concise explanation directly answering the question. Use bullet points or short paragraphs. No lengthy introductions or conclusions.`;

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

    // Validate the response is not empty
    if (!text.trim()) {
      throw new Error('Empty response from AI model');
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

    // For JSON parsing errors, provide a more specific message
    if (error.message?.includes('JSON') || error.message?.includes('parse')) {
      return NextResponse.json(
        { error: 'The AI service returned an invalid response. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate explanation. Please try again.' },
      { status: 500 }
    );
  }
}
