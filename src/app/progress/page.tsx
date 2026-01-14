'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';

export default function ProgressPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // Redirect to dashboard if authenticated, or home if not
    if (status === 'authenticated') {
      router.push('/dashboard');
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-bone)' }}>
      <Header />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse">
            <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--accent-soft)' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Redirecting...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
