import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
  rationale: string;
  difficulty: string;
}

export async function generateQuestions(
  prompt: string,
  count: number,
  keywords: string[]
): Promise<GeneratedQuestion[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const enhancedPrompt = `You are an expert technical interviewer creating high-quality multiple-choice questions.

Topic: ${prompt}
Keywords: ${keywords.join(', ')}
Number of questions: ${count}

Generate exactly ${count} interview-level multiple-choice questions. Each question must:
1. Be clear, unambiguous, and professionally worded
2. Have exactly 4 options (A, B, C, D)
3. Have only ONE correct answer
4. Include a detailed rationale explaining why the answer is correct
5. Be at Medium difficulty level (suitable for technical interviews)

Return a valid JSON array with this exact structure:
[
  {
    "questionText": "Clear question text here?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": "A",
    "rationale": "Detailed explanation of why this answer is correct and others are wrong",
    "difficulty": "Medium"
  }
]

Important:
- Return ONLY the JSON array, no additional text
- Ensure all strings are properly escaped
- Make questions practical and interview-relevant
- Avoid overly theoretical or trivial questions`;

  try {
    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const questions = JSON.parse(jsonText);

    // Validate structure
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format');
    }

    return questions.map((q: any) => ({
      questionText: q.questionText || '',
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correctAnswer || 'A',
      rationale: q.rationale || 'No explanation provided.',
      difficulty: q.difficulty || 'Medium',
    }));

  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
}
