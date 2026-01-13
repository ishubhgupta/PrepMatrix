'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Settings, User, LogOut, LogIn, ChevronDown, BookOpen, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[color:var(--bg-bone)]/95 backdrop-blur-md shadow-[var(--shadow-softer)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[color:var(--accent)] text-white font-bold text-base flex items-center justify-center shadow-[var(--shadow-softer)] transition-transform group-hover:scale-105">
              PM
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-strong)' }}>
              PrepMatrix
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/') && pathname === '/'
                  ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
              }`}
            >
              Home
            </Link>
            <Link
              href="/progress/"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/progress')
                  ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
              }`}
            >
              Progress
            </Link>
            
            <div className="w-px h-6 bg-black/10 mx-2"></div>
            
            <Link
              href="/quiz/DBMS/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/quiz/DBMS')
                  ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
              }`}
            >
              DBMS
            </Link>
            <Link
              href="/quiz/PythonML/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/quiz/PythonML')
                  ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
              }`}
            >
              Python
            </Link>
            <Link
              href="/quiz/CppOOP/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/quiz/CppOOP')
                  ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
              }`}
            >
              C++
            </Link>
            <Link
              href="/quiz/GenAI/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/quiz/GenAI')
                  ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
              }`}
            >
              GenAI
            </Link>
            <Link
              href="/quiz/OS/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/quiz/OS')
                  ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
              }`}
            >
              OS
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {status === 'authenticated' ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[color:var(--accent-soft)]">
                  <User className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <Link
                  href="/settings/"
                  className="p-2.5 rounded-xl hover:bg-black/5 transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    Sign Out
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 transition-colors"
                >
                  <LogIn className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    Sign In
                  </span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden md:block btn btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </Link>
                <Link
                  href="/settings/"
                  className="p-2.5 rounded-xl hover:bg-black/5 transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-black/5 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" style={{ color: 'var(--text-strong)' }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/5 bg-[color:var(--bg-bone)]/98 backdrop-blur-md py-4">
            <div className="space-y-1">
              <Link
                href="/"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive('/') && pathname === '/'
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/progress/"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive('/progress')
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Progress
              </Link>
              
              <div className="px-4 py-2">
                <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  Subjects
                </div>
              </div>
              
              <Link
                href="/quiz/DBMS/"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive('/quiz/DBMS')
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                DBMS
              </Link>
              <Link
                href="/quiz/PythonML/"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive('/quiz/PythonML')
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Python ML
              </Link>
              <Link
                href="/quiz/CppOOP/"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive('/quiz/CppOOP')
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                C++ OOP
              </Link>
              <Link
                href="/quiz/GenAI/"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive('/quiz/GenAI')
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                GenAI
              </Link>
              <Link
                href="/quiz/OS/"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive('/quiz/OS')
                    ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Operating Systems
              </Link>
              
              <div className="pt-4 border-t border-black/5 mt-4">
                <Link
                  href="/settings/"
                  className="block px-4 py-3 text-base font-medium rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                
                {status === 'authenticated' ? (
                  <>
                    <div className="px-4 py-3 text-base font-medium" style={{ color: 'var(--accent)' }}>
                      {session?.user?.name || session?.user?.email}
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full text-left px-4 py-3 text-base font-medium rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-3 text-base font-medium rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--text-strong)] hover:bg-black/5 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-3 text-base font-medium rounded-lg text-[color:var(--accent)] bg-[color:var(--accent-soft)] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
