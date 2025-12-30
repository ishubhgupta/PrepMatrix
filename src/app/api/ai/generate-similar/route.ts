import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { question, subject, topic, difficulty } = await request.json();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    if (!question || !subject || !topic || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Based on this question: "${question}"
      
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Generate a similar question with the same difficulty level and topic. Return ONLY a valid JSON object with this exact structure:

{
  "question": "new question text here",
  "options": ["option A text", "option B text", "option C text", "option D text"],
  "correctAnswer": "A",
  "explanation": "concise explanation in 2-3 sentences"
}

Make sure:
- The question tests similar concepts but is not identical
- All 4 options are plausible but only one is correct
- The correctAnswer field contains only A, B, C, or D
- The explanation is clear, concise (max 3 sentences), and educational
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
      // Clean the response text and validate it's not empty
      const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
      
      if (!cleanText) {
        throw new Error('Empty response from AI model');
      }

      // Check if the response looks like JSON
      if (!cleanText.startsWith('{') || !cleanText.endsWith('}')) {
        console.error('Invalid JSON format from AI:', cleanText);
        throw new Error('AI response is not in valid JSON format');
      }

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

    // For JSON parsing errors, provide a more specific message
    if (error.message?.includes('JSON') || error.message?.includes('parse')) {
      return NextResponse.json(
        { error: 'The AI service returned an invalid response. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate similar question. Please try again.' },
      { status: 500 }
    );
  }
}
