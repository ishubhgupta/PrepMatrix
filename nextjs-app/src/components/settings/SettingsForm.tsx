'use client';

import { useState } from 'react';
import { useChatStore } from '@/lib/store/chat-store';
import { useUIStore } from '@/lib/store/ui-store';

export function SettingsForm() {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  
  const { geminiConfig, setGeminiConfig, validateGeminiKey } = useChatStore();
  const { preferences, updatePreferences } = useUIStore();

  const handleValidateApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationMessage('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setValidationMessage('');

    try {
      const isValid = await validateGeminiKey(apiKey);
      
      if (isValid) {
        setValidationMessage('✅ API key validated successfully!');
        setApiKey(''); // Clear the input for security
      } else {
        setValidationMessage('❌ Invalid API key. Please check and try again.');
      }
    } catch (error) {
      setValidationMessage('❌ Error validating API key. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDisableAI = () => {
    setGeminiConfig({ enabled: false, apiKey: null });
    setValidationMessage('AI features disabled');
  };

  return (
    <div className="space-y-8">
      {/* AI Features Section */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
          AI Features (Gemini)
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Gemini API Key
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="input flex-1"
                disabled={isValidating}
              />
              <button
                onClick={handleValidateApiKey}
                disabled={isValidating || !apiKey.trim()}
                className="btn btn-primary"
              >
                {isValidating ? 'Validating...' : 'Validate & Enable'}
              </button>
            </div>
            {validationMessage && (
              <p className="text-sm mt-2 text-secondary-600 dark:text-secondary-400">
                {validationMessage}
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Privacy & Security Notice
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your API key is stored only in your browser cookie and never sent to any server 
              other than Google's Gemini API when you use AI features. We recommend using a 
              restricted API key for additional security.
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              Get your API key from: <a href="https://makersuite.google.com/app/apikey" 
              target="_blank" rel="noopener noreferrer" className="underline">
                Google AI Studio
              </a>
            </p>
          </div>

          {geminiConfig.enabled && (
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✅ AI features are enabled
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Last validated: {geminiConfig.lastValidated ? 
                    new Date(geminiConfig.lastValidated).toLocaleString() : 'Never'}
                </p>
              </div>
              <button
                onClick={handleDisableAI}
                className="btn btn-danger text-sm"
              >
                Disable
              </button>
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
