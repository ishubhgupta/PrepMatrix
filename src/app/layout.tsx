import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PrepMatrix - Quiz Practice Platform',
  description: 'Master technical interviews with interactive quizzes across DBMS, Python ML, C++ OOP, and GenAI topics.',
  keywords: 'quiz, practice, interview, DBMS, Python, ML, C++, OOP, GenAI, LLM',
  authors: [{ name: 'PrepMatrix' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
