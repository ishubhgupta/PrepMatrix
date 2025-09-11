import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, question, subject, topic, difficulty } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!question || !subject || !topic || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Based on this question: "${question}"
      
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Generate a similar question with the same difficulty level and topic. Return ONLY a valid JSON object with this exact structure:

{
  "question": "new question text here",
  "options": ["option A text", "option B text", "option C text", "option D text"],
  "correctAnswer": "A",
  "explanation": "brief explanation of why this answer is correct"
}

Make sure:
- The question tests similar concepts but is not identical
- All 4 options are plausible but only one is correct
- The correctAnswer field contains only A, B, C, or D
- The explanation is clear and educational
- Return only the JSON object, no other text`;

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

    // Try to parse the JSON response
    let parsedQuestion;
    try {
      // Clean the response text
      const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
      parsedQuestion = JSON.parse(cleanText);
      
      // Validate the structure
      if (!parsedQuestion.question || !parsedQuestion.options || !parsedQuestion.correctAnswer || !parsedQuestion.explanation) {
        throw new Error('Invalid question structure');
      }
      
      if (!Array.isArray(parsedQuestion.options) || parsedQuestion.options.length !== 4) {
        throw new Error('Invalid options array');
      }
      
      if (!['A', 'B', 'C', 'D'].includes(parsedQuestion.correctAnswer)) {
        throw new Error('Invalid correct answer');
      }
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      throw new Error('Failed to generate a properly formatted question');
    }

    return NextResponse.json({ 
      success: true, 
      generatedQuestion: parsedQuestion
    });

  } catch (error: any) {
    console.error('Error generating similar question:', error);
    
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
      { error: 'Failed to generate similar question. Please try again.' },
      { status: 500 }
    );
  }
}
