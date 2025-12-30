'use client';

import { useChatStore } from '@/lib/store/chat-store';
import { useUIStore } from '@/lib/store/ui-store';

export function SettingsForm() {
  const { geminiConfig } = useChatStore();
  const { preferences, updatePreferences } = useUIStore();

  return (
    <div className="space-y-8">
      {/* AI Features Section */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
          AI Features (Gemini)
        </h2>
        
        <div className="space-y-4">
          {geminiConfig.enabled ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">
                ✅ AI features are enabled
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                AI-powered question generation and explanations are ready to use.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                ⚠️ AI features are not configured
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                To enable AI features, add your Gemini API key to the .env.local file:
              </p>
              <code className="block mt-3 p-2 bg-secondary-100 dark:bg-secondary-800 rounded text-xs">
                GEMINI_API_KEY=your_api_key_here
              </code>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                Get your API key from: <a href="https://makersuite.google.com/app/apikey" 
                target="_blank" rel="noopener noreferrer" className="underline">
                  Google AI Studio
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* UI Preferences Section */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
          Preferences
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-secondary-900 dark:text-white">
                Theme
              </label>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Choose your preferred color scheme
              </p>
            </div>
            <select
              value={preferences.theme}
              onChange={(e) => updatePreferences({ theme: e.target.value as any })}
              className="select"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-secondary-900 dark:text-white">
                Show Charts
              </label>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Display visual analytics on dashboard
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.showCharts}
              onChange={(e) => updatePreferences({ showCharts: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-secondary-900 dark:text-white">
                Compact Cards
              </label>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Use smaller question cards
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.compactCards}
              onChange={(e) => updatePreferences({ compactCards: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-secondary-900 dark:text-white">
                Auto-reveal Rationale
              </label>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Automatically show explanation after answering
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.autoRevealRationale}
              onChange={(e) => updatePreferences({ autoRevealRationale: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-secondary-900 dark:text-white">
                Keyboard Shortcuts
              </label>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Enable keyboard navigation (J/K, 1-4, etc.)
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.keyboardShortcuts}
              onChange={(e) => updatePreferences({ keyboardShortcuts: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
          Data Management
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-secondary-900 dark:text-white">
                Export Progress
              </label>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Download your progress and notes as JSON
              </p>
            </div>
            <button className="btn btn-secondary">
              Export Data
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-secondary-900 dark:text-white">
                Reset All Data
              </label>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Clear all progress, preferences, and chat history
              </p>
            </div>
            <button className="btn btn-danger">
              Reset App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
