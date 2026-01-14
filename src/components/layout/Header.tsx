'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ChevronDown, User, LogOut, LogIn, BookOpen, AlertTriangle, TrendingUp, Calendar, Home as HomeIcon, Brain, Sparkles, Mic } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const subjectRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const subjects = [
    { name: 'DBMS', path: '/quiz/DBMS' },
    { name: 'Python ML', path: '/quiz/PythonML' },
    { name: 'C++ OOP', path: '/quiz/CppOOP' },
    { name: 'GenAI & LLMs', path: '/quiz/GenAI' },
    { name: 'Operating Systems', path: '/quiz/OS' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
        setSubjectDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[color:var(--bg-bone)]/95 backdrop-blur-md shadow-[var(--shadow-softer)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={status === 'authenticated' ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[color:var(--accent)] text-white font-bold text-sm flex items-center justify-center shadow-[var(--shadow-softer)] transition-transform group-hover:scale-105">
              PM
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block" style={{ color: 'var(--text-strong)' }}>
              PrepMatrix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Home/Dashboard Link */}
            {status === 'authenticated' ? (
              <Link
                href="/dashboard"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/') && pathname === '/'
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
              </Link>
            )}

            {/* Subject Dropdown */}
            <div className="relative" ref={subjectRef}>
              <button
                onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                  isActive('/quiz')
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Subjects</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              {subjectDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 w-48 card py-2 shadow-lg">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.path}
                      href={subject.path}
                      onClick={() => setSubjectDropdownOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive(subject.path)
                          ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)] font-medium'
                          : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                      }`}
                    >
                      {subject.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Authenticated User Features */}
            {status === 'authenticated' && (
              <>
                <Link
                  href="/study-coach"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    isActive('/study-coach')
                      ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Study Coach</span>
                </Link>

                <Link
                  href="/custom-quiz"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    isActive('/custom-quiz')
                      ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Quiz</span>
                </Link>

                <Link
                  href="/mock-interview"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    isActive('/mock-interview')
                      ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>Mock Interview</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {status === 'authenticated' ? (
              <div className="relative hidden md:block" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium hidden lg:block" style={{ color: 'var(--text-strong)' }}>
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 w-48 card py-2 shadow-lg">
                    <div className="px-4 py-2 border-b border-black/5">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>
                        {session.user?.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {session.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/analytics"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5 transition-colors flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Analytics
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5 transition-colors"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/signin" className="px-4 py-2 text-sm font-medium rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5 transition-colors flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link href="/auth/signup" className="btn btn-primary text-sm px-4 py-2">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" style={{ color: 'var(--text-strong)' }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/5 py-4 space-y-1">
            {status === 'authenticated' ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-base font-medium rounded-lg ${
                  isActive('/dashboard')
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)]'
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-base font-medium rounded-lg ${
                  isActive('/') && pathname === '/'
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)]'
                }`}
              >
                Home
              </Link>
            )}

            <div className="px-4 py-2 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
              Subjects
            </div>
            {subjects.map((subject) => (
              <Link
                key={subject.path}
                href={subject.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-base font-medium rounded-lg ${
                  isActive(subject.path)
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)]'
                }`}
              >
                {subject.name}
              </Link>
            ))}

            {status === 'authenticated' && (
              <>
                <div className="px-4 py-2 text-xs font-semibold uppercase mt-4" style={{ color: 'var(--text-muted)' }}>
                  Your Tools
                </div>
                <Link href="/study-coach" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-lg text-[color:var(--text-muted)]">
                  AI Study Coach
                </Link>
                <Link href="/errors" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-lg text-[color:var(--text-muted)]">
                  Error Notebook
                </Link>
                <Link href="/confidence" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-lg text-[color:var(--text-muted)]">
                  Confidence Analysis
                </Link>
                <Link href="/custom-quiz" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-lg text-[color:var(--text-muted)]">
                  AI Quiz Generator
                </Link>
                <Link href="/analytics" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-lg text-[color:var(--text-muted)]">
                  Analytics
                </Link>
                <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-lg text-[color:var(--text-muted)]">
                  Settings
                </Link>

                <div className="pt-4 border-t border-black/5 mt-4">
                  <div className="px-4 py-2 text-sm font-medium" style={{ color: 'var(--text-strong)' }}>
                    {session.user?.name}
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full text-left px-4 py-2 text-base font-medium text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}

            {status !== 'authenticated' && (
              <div className="pt-4 border-t border-black/5 mt-4 space-y-2">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium text-[color:var(--text-muted)]">
                  Sign In
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium text-[color:var(--accent)] bg-[color:var(--accent-soft)] rounded-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
