import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    // Get example prompts from user's error notebook
    const errorNotebook = await prisma.errorNotebook.findMany({
      where: {
        userId: user.id,
        isResolved: false,
      },
      include: {
        question: {
          select: {
            topic: true,
            subject: true,
          },
        },
      },
      take: 10,
      orderBy: {
        incorrectCount: 'desc',
      },
    });

    // Extract unique topics and subjects
    const topics = new Set<string>();
    const subjects = new Set<string>();

    errorNotebook.forEach((entry: any) => {
      if (entry.question.topic) topics.add(entry.question.topic);
      if (entry.question.subject) subjects.add(entry.question.subject);
    });

    // Create example prompts based on errors
    const examplePrompts: string[] = [];

    // Add topic-based examples
    Array.from(topics).slice(0, 3).forEach(topic => {
      examplePrompts.push(`Practice questions on ${topic}`);
    });

    // Add subject-based examples
    Array.from(subjects).slice(0, 2).forEach(subject => {
      examplePrompts.push(`${subject} interview preparation questions`);
    });

    // Add general examples if not enough from errors
    if (examplePrompts.length < 5) {
      const generalExamples = [
        'DBMS transactions and ACID properties',
        'React Hooks interview questions',
        'Operating System process scheduling algorithms',
        'Python data structures and algorithms',
        'C++ object-oriented programming concepts',
      ];
      
      // Add general examples that don't overlap
      generalExamples.forEach(ex => {
        if (examplePrompts.length < 5 && !examplePrompts.some(p => p.includes(ex.split(' ')[0]))) {
          examplePrompts.push(ex);
        }
      });
    }

    return NextResponse.json({
      success: true,
      examples: examplePrompts.slice(0, 5),
      errorTopics: Array.from(topics),
      errorSubjects: Array.from(subjects),
    });

  } catch (error) {
    console.error('Error fetching examples:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
