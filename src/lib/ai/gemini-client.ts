import { 
  GenerateSimilarQuestionRequest, 
  ExplainLikeRequest, 
  TutorChatRequest,
  Question,
  ChatMessage
} from '@/types';
import Cookies from 'js-cookie';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL_NAME = 'gemini-2.5-flash';

// Custom error class for Gemini-specific errors
class GeminiError extends Error {
  code: string;
  retryAfter?: number;
  quotaExceeded?: boolean;
  details?: Record<string, unknown>;

  constructor({ code, message, retryAfter, details }: {
    code: string;
    message: string;
    retryAfter?: number;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.name = 'GeminiError';
    this.code = code;
    this.retryAfter = retryAfter;
    this.quotaExceeded = code === 'RATE_LIMIT_EXCEEDED';
    this.details = details;
  }
}

class GeminiClient {
  private getApiKey(): string | null {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
  }

  private async makeRequest(endpoint: string, payload: any): Promise<any> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.');
    }

    try {
      const response = await fetch(`${GEMINI_API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new GeminiError({
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: 60,
          });
        }
        
        if (response.status === 401 || response.status === 403) {
          throw new GeminiError({
            code: 'INVALID_API_KEY',
            message: 'Invalid API key. Please check your Gemini API key in settings.',
          });
        }

        throw new GeminiError({
          code: 'API_ERROR',
          message: errorData.error?.message || 'Failed to communicate with Gemini API',
          details: errorData,
        });
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof GeminiError) {
        throw error;
      }
      
      throw new GeminiError({
        code: 'NETWORK_ERROR',
        message: 'Network error while communicating with Gemini API',
        details: { originalError: error },
      });
    }
  }

  async generateSimilarQuestion(request: GenerateSimilarQuestionRequest): Promise<Question> {
    const prompt = this.createSimilarQuestionPrompt(request);
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await this.makeRequest(`models/${MODEL_NAME}:generateContent`, payload);
    
    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = response.candidates[0].content.parts[0].text;
    
    try {
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || 
                       generatedText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const questionData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      
      // Generate a unique ID for the generated question
      const generatedId = `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: generatedId,
        subject: request.subject as any,
        topic: request.topic,
        difficulty: request.difficulty as any,
        question: questionData.question,
        options: questionData.options,
        rationale: questionData.rationale,
      };
    } catch (parseError) {
      throw new Error('Failed to parse generated question JSON');
    }
  }

  async explainLike(request: ExplainLikeRequest): Promise<string> {
    const prompt = this.createExplainLikePrompt(request);
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      }
    };

    const response = await this.makeRequest(`models/${MODEL_NAME}:generateContent`, payload);
    
    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    return response.candidates[0].content.parts[0].text.trim();
  }

  async tutorChat(request: TutorChatRequest): Promise<string> {
    const prompt = this.createTutorChatPrompt(request);
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      }
    };

    const response = await this.makeRequest(`models/${MODEL_NAME}:generateContent`, payload);
    
    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    return response.candidates[0].content.parts[0].text.trim();
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${GEMINI_API_BASE}/models/${MODEL_NAME}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Test' }]
          }],
          generationConfig: {
            maxOutputTokens: 1,
          }
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  private createSimilarQuestionPrompt(request: GenerateSimilarQuestionRequest): string {
    return `Create a similar multiple-choice question based on the following example. The new question should test the same concept but use different wording, examples, or context.

Original Question:
Subject: ${request.subject}
Topic: ${request.topic}
Difficulty: ${request.difficulty}
Question: ${request.question}
Options: ${request.options.map((opt, i) => `${i + 1}. ${opt.text} ${opt.correct ? '(CORRECT)' : ''}`).join('\n')}
Rationale: ${request.rationale}

Requirements:
1. Same subject, topic, and difficulty level
2. Test the same underlying concept
3. Different wording/context from the original
4. Exactly 4 options with 1 correct answer
5. Clear, educational rationale

Return ONLY a JSON object in this exact format:
\`\`\`json
{
  "question": "Your new question here",
  "options": [
    {"text": "Option 1", "correct": false},
    {"text": "Option 2", "correct": true},
    {"text": "Option 3", "correct": false},
    {"text": "Option 4", "correct": false}
  ],
  "rationale": "Clear explanation of why the correct answer is right and others are wrong"
}
\`\`\``;
  }

  private createExplainLikePrompt(request: ExplainLikeRequest): string {
    const modeInstructions = {
      'like-5': 'Explain using very simple language, analogies, and examples that a 5-year-old could understand.',
      'new-topic': 'Explain assuming the person is completely new to this topic, defining all terms clearly.',
      'with-sql': 'Include SQL examples and database-specific explanations where relevant.',
      'with-code': 'Include code examples and programming context where applicable.',
    };

    const instruction = modeInstructions[request.mode] || modeInstructions['new-topic'];

    return `${instruction}

Question: ${request.question}
Your Answer: ${request.userAnswer}
Correct Answer: ${request.correctAnswer}
Original Rationale: ${request.rationale}

Please provide a tailored explanation that helps the user understand why their answer was wrong (if it was) and reinforces the correct concept. Keep it concise but thorough.`;
  }

  private createTutorChatPrompt(request: TutorChatRequest): string {
    const conversationHistory = request.messages
      .slice(-5) // Keep last 5 messages for context
      .map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
      .join('\n');

    let contextInfo = `Subject: ${request.subject}\nTopic: ${request.topic}`;
    
    if (request.context) {
      contextInfo += `\nContext: Student is working on question ${request.context.questionId}`;
      if (request.context.userAnswer && request.context.correctAnswer) {
        contextInfo += `\nStudent answered: ${request.context.userAnswer}`;
        contextInfo += `\nCorrect answer: ${request.context.correctAnswer}`;
      }
    }

    return `You are a helpful programming and computer science tutor. You're having a conversation with a student about ${request.subject} - ${request.topic}.

${contextInfo}

Previous conversation:
${conversationHistory}

Guidelines:
- Be encouraging and supportive
- Ask Socratic questions to guide learning
- Provide hints rather than direct answers when possible
- Keep responses concise (2-3 sentences)
- Stay focused on the topic
- Use examples relevant to the subject matter

Respond as the tutor would to continue this educational conversation.`;
  }

  // Mock responses for testing/demo when no API key is available
  getMockResponse(type: 'similar' | 'explain' | 'chat', request: any): any {
    switch (type) {
      case 'similar':
        return {
          id: `mock-${Date.now()}`,
          subject: request.subject,
          topic: request.topic,
          difficulty: request.difficulty,
          question: "This is a mock generated question for demonstration purposes.",
          options: [
            { text: "Mock option A", correct: false },
            { text: "Mock option B (correct)", correct: true },
            { text: "Mock option C", correct: false },
            { text: "Mock option D", correct: false }
          ],
          rationale: "This is a mock rationale explaining why option B is correct."
        };
      
      case 'explain':
        return "This is a mock explanation. In a real implementation with your Gemini API key, this would provide a tailored explanation based on your selected mode.";
      
      case 'chat':
        return "This is a mock tutor response. With a valid Gemini API key, I would provide personalized tutoring based on our conversation context.";
      
      default:
        return null;
    }
  }
}

// Singleton instance
export const geminiClient = new GeminiClient();
