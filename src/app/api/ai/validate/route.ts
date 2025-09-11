import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Retry logic for overloaded API
    let result;
    let text;
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // Simple test prompt to validate the API key
        result = await model.generateContent('Hello, this is a test message. Please respond with "API key is valid".');
        const response = await result.response;
        text = response.text();
        break; // Success, exit retry loop
      } catch (retryError: any) {
        retryCount++;
        
        if (retryError.status === 503 && retryCount < maxRetries) {
          // Wait before retrying (exponential backoff)
          const waitTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
          console.log(`API overloaded, retrying validation in ${waitTime}ms... (attempt ${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // If it's the last retry or not a 503 error, throw it
        throw retryError;
      }
    }

    // Check if we got a valid response
    if (text && text.trim().length > 0) {
      return NextResponse.json({
        success: true,
        valid: true,
        message: 'API key is valid'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid or empty response from API', valid: false },
        { status: 400 }
      );
    }  } catch (error: any) {
    console.error('Error validating API key:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Gemini API key.', valid: false },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('QUOTA_EXCEEDED') || error.status === 429) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.', valid: false },
        { status: 429 }
      );
    }

    if (error.status === 503 || error.message?.includes('overloaded')) {
      return NextResponse.json(
        { error: 'AI service is currently overloaded. Please try again in a few moments.', valid: false },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to validate API key. Please try again.', valid: false },
      { status: 500 }
    );
  }
}
