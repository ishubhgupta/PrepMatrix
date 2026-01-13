'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUIStore } from '@/lib/store/ui-store';
import { Menu, X, Settings, Moon, Sun, Monitor } from 'lucide-react';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    if (!mounted) {
      return <Monitor className="w-5 h-5" />;
    }
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
    <header className="sticky top-0 z-50 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 shadow-sm">
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent">
                  PrepMatrix
                </span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400 -mt-1">
                  AI-Powered Learning
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-1">
              <Link
                href="/"
                className="relative text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 group"
              >
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
              <Link
                href="/progress/"
                className="relative text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 group"
              >
                <span className="relative z-10">Progress</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
              <Link
                href="/quiz/DBMS/"
                className="relative text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
              >
                <span className="relative z-10">DBMS</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
              <Link
                href="/quiz/PythonML/"
                className="relative text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 group"
              >
                <span className="relative z-10">Python ML</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
              <Link
                href="/quiz/CppOOP/"
                className="relative text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 group"
              >
                <span className="relative z-10">C++ OOP</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
              <Link
                href="/quiz/GenAI/"
                className="relative text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 group"
              >
                <span className="relative z-10">GenAI</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
              <Link
                href="/quiz/OS/"
                className="relative text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 group"
              >
                <span className="relative z-10">OS</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="relative p-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-all duration-300 group transform hover:scale-105"
              aria-label="Toggle theme"
            >
              <div className="relative">
                {getThemeIcon()}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </button>

            {/* Settings */}
            <Link
              href="/settings/"
              className="relative p-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-all duration-300 group transform hover:scale-105"
              aria-label="Open settings"
            >
              <div className="relative">
                <Settings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative p-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-all duration-300 group transform hover:scale-105"
              aria-label="Toggle mobile menu"
            >
              <div className="relative">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200/50 dark:border-secondary-700/50 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl">
            <div className="py-4 space-y-1 px-4">
              <Link
                href="/"
                className="block px-4 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/progress/"
                className="block px-4 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Progress
              </Link>
              <Link
                href="/quiz/DBMS/"
                className="block px-4 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                DBMS
              </Link>
              <Link
                href="/quiz/PythonML/"
                className="block px-4 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Python ML
              </Link>
              <Link
                href="/quiz/CppOOP/"
                className="block px-4 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                C++ OOP
              </Link>
              <Link
                href="/quiz/GenAI/"
                className="block px-4 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                GenAI
              </Link>
              <Link
                href="/quiz/OS/"
                className="block px-4 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                OS
              </Link>
              <Link
                href="/settings/"
                className="block px-4 py-3 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
