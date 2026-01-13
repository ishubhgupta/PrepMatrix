'use client';

import { useChatStore } from '@/lib/store/chat-store';
import { useUIStore } from '@/lib/store/ui-store';

export function SettingsForm() {
  const { geminiConfig } = useChatStore();
  const { preferences, updatePreferences } = useUIStore();

  return (
    <div className="space-y-8">


      {/* UI Preferences Section */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-strong)' }}>
          Preferences
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium" style={{ color: 'var(--text-strong)' }}>
                Theme
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
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
              <label className="font-medium" style={{ color: 'var(--text-strong)' }}>
                Show Charts
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Display visual analytics on dashboard
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.showCharts}
              onChange={(e) => updatePreferences({ showCharts: e.target.checked })}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium" style={{ color: 'var(--text-strong)' }}>
                Compact Cards
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Use smaller question cards
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.compactCards}
              onChange={(e) => updatePreferences({ compactCards: e.target.checked })}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium" style={{ color: 'var(--text-strong)' }}>
                Auto-reveal Rationale
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Automatically show explanation after answering
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.autoRevealRationale}
              onChange={(e) => updatePreferences({ autoRevealRationale: e.target.checked })}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium" style={{ color: 'var(--text-strong)' }}>
                Keyboard Shortcuts
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Enable keyboard navigation (J/K, 1-4, etc.)
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.keyboardShortcuts}
              onChange={(e) => updatePreferences({ keyboardShortcuts: e.target.checked })}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-strong)' }}>
          Data Management
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium" style={{ color: 'var(--text-strong)' }}>
                Export Progress
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Download your progress and notes as JSON
              </p>
            </div>
            <button className="btn btn-secondary">
              Export Data
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium" style={{ color: 'var(--text-strong)' }}>
                Reset All Data
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
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
