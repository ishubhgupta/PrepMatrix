'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUIStore } from '@/lib/store/ui-store';
import { Menu, X, Settings, Moon, Sun, Monitor } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, setSettingsOpen } = useUIStore();

  const handleThemeToggle = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm border-b border-secondary-200 dark:border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-secondary-900 dark:text-white">
                PrepMatrix
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              <Link
                href="/"
                className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/quiz/DBMS"
                className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                DBMS
              </Link>
              <Link
                href="/quiz/PythonML"
                className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Python ML
              </Link>
              <Link
                href="/quiz/CppOOP"
                className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                C++ OOP
              </Link>
              <Link
                href="/quiz/GenAI"
                className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                GenAI
              </Link>
              <Link
                href="/review"
                className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Review
              </Link>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="btn-ghost p-2"
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </button>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="btn-ghost p-2"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn-ghost p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 dark:border-secondary-700 py-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/quiz/DBMS"
              className="block px-3 py-2 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              DBMS
            </Link>
            <Link
              href="/quiz/PythonML"
              className="block px-3 py-2 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Python ML
            </Link>
            <Link
              href="/quiz/CppOOP"
              className="block px-3 py-2 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              C++ OOP
            </Link>
            <Link
              href="/quiz/GenAI"
              className="block px-3 py-2 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              GenAI
            </Link>
            <Link
              href="/review"
              className="block px-3 py-2 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Review
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
