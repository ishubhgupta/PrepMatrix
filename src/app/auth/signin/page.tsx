'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-bone)' }}>
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: 'var(--text-strong)' }}>
            Welcome Back
          </h1>
          <p className="text-center mb-8" style={{ color: 'var(--text-muted)' }}>
            Sign in to access advanced features
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-strong)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input w-full"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-strong)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input w-full"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-medium hover:opacity-70" style={{ color: 'var(--accent)' }}>
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              <strong>Note:</strong> You can continue using all current features without logging in. 
              Sign in to unlock AI mock interviews, error tracking, and personalized analytics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
