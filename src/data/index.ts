import { Question } from '@/types';
import { dbmsQuestions } from './dbms';
import { pythonMLQuestions } from './python-ml';
import { cppOOPQuestions } from './cpp-oop';
import { genAIQuestions } from './genai';
import { osQuestions } from './os';

// Combine all questions
export const allQuestions: Question[] = [
  ...dbmsQuestions,
  ...pythonMLQuestions,
  ...cppOOPQuestions,
  ...genAIQuestions,
  ...osQuestions,
];

// Subject metadata
export const subjects = [
  {
    id: 'DBMS',
    name: 'Database Management Systems',
    description: 'Relational databases, SQL, and DBMS concepts',
    color: 'bg-blue-500',
    totalQuestions: dbmsQuestions.length,
  },
  {
    id: 'PythonML',
    name: 'Python for Machine Learning',
    description: 'Python, NumPy, Pandas, and ML fundamentals',
    color: 'bg-green-500',
    totalQuestions: pythonMLQuestions.length,
  },
  {
    id: 'CppOOP',
    name: 'C++ Object-Oriented Programming',
    description: 'Classes, inheritance, polymorphism, and OOP concepts',
    color: 'bg-purple-500',
    totalQuestions: cppOOPQuestions.length,
  },
  {
    id: 'GenAI',
    name: 'Generative AI & LLMs',
    description: 'Large language models, prompt engineering, and AI applications',
    color: 'bg-orange-500',
    totalQuestions: genAIQuestions.length,
  },
  {
    id: 'OS',
    name: 'Operating Systems',
    description: 'Processes, scheduling, memory, filesystems, and OS architecture',
    color: 'bg-cyan-500',
    totalQuestions: osQuestions.length,
  },
] as const;

// Topic mappings for better organization
export const topicMappings = {
  DBMS: {
    'Introduction & Architecture': 'Intro & Architecture',
    'Database Languages': 'DB Languages',
    'DBMS Components': 'Components',
    'Data Models': 'Data Models',
    'Data Independence': 'Data Independence',
    'Database Administration': 'Administration',
    'Data Dictionary': 'Data Dictionary',
    'Relational Model': 'Relational Model',
    'ER Model': 'ER Model',
  },
  PythonML: {
    'Python Core for ML': 'Python Core',
    'NumPy Essentials': 'NumPy',
    'Code Output & Bug Hunts': 'Code Analysis',
    'Scikit-learn Core': 'Scikit-learn',
    'Pandas & Data Handling': 'Pandas',
    'Data Loading & Preprocessing': 'Preprocessing',
    'Feature Engineering': 'Feature Engineering',
    'Model Evaluation': 'Evaluation',
    'Cross-validation': 'Cross-validation',
    'Hyperparameter Tuning': 'Hyperparameters',
  },
  CppOOP: {
    'OOP Fundamentals': 'OOP Basics',
    'Classes & Objects': 'Classes',
    'Constructors & Destructors': 'Constructors',
    'Code Analysis': 'Code Analysis',
    'Inheritance': 'Inheritance',
    'Polymorphism': 'Polymorphism',
    'Virtual Functions': 'Virtual Functions',
    'Abstract Classes': 'Abstract Classes',
  },
  GenAI: {
    'LLM & GenAI Fundamentals': 'Fundamentals',
    'RAG & Retrieval': 'RAG',
    'Prompt Engineering': 'Prompting',
    'Fine-tuning & Adaptation': 'Fine-tuning',
    'Agents & Tool Use': 'Agents',
    'Model Architecture': 'Architecture',
    'Embeddings & Vector Search': 'Embeddings',
    'Training & Optimization': 'Training',
    'Evaluation & Metrics': 'Evaluation',
    'Ethical AI & Safety': 'Ethics & Safety',
  },
  OS: {
    A: 'OS Basics',
    B: 'Processes & Threads',
    C: 'CPU Scheduling',
    D: 'Synchronization',
    E: 'Deadlocks',
    F: 'Memory Management',
    G: 'Virtual Memory',
    H: 'File Systems',
    I: 'I/O Systems',
    J: 'Advanced OS',
  },
};

// Utility functions
export function getQuestionsBySubject(subject: string): Question[] {
  // Case-insensitive subject matching
  return allQuestions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
}

export function getQuestionsByTopic(topic: string): Question[] {
  return allQuestions.filter(q => q.topic === topic);
}

export function getQuestionsByDifficulty(difficulty: string): Question[] {
  return allQuestions.filter(q => q.difficulty === difficulty);
}

export function getFilteredQuestions(filters: {
  subjects?: string[];
  topics?: string[];
  difficulties?: string[];
}): Question[] {
  return allQuestions.filter(question => {
    const subjectMatch = !filters.subjects?.length || filters.subjects.includes(question.subject);
    const topicMatch = !filters.topics?.length || filters.topics.includes(question.topic);
    const difficultyMatch = !filters.difficulties?.length || filters.difficulties.includes(question.difficulty);
    
    return subjectMatch && topicMatch && difficultyMatch;
  });
}

export function getTopicsBySubject(subject: string): string[] {
  const questions = getQuestionsBySubject(subject);
  return [...new Set(questions.map(q => q.topic))].sort();
}

export function getAllTopics(): string[] {
  return [...new Set(allQuestions.map(q => q.topic))].sort();
}

export function getAllDifficulties(): string[] {
  return ['Easy', 'Medium', 'Hard'];
}

export function getQuestionStats() {
  const stats = {
    total: allQuestions.length,
    bySubject: {} as Record<string, number>,
    byDifficulty: {} as Record<string, number>,
    byTopic: {} as Record<string, number>,
  };

  allQuestions.forEach(question => {
    stats.bySubject[question.subject] = (stats.bySubject[question.subject] || 0) + 1;
    stats.byDifficulty[question.difficulty] = (stats.byDifficulty[question.difficulty] || 0) + 1;
    stats.byTopic[question.topic] = (stats.byTopic[question.topic] || 0) + 1;
  });

  return stats;
}
