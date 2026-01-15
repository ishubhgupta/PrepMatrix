'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useChatStore } from '@/lib/store/chat-store';
import { useUIStore } from '@/lib/store/ui-store';
import { User, Bell, Database, Keyboard, Eye, BarChart3, Download, Trash2 } from 'lucide-react';

export function SettingsForm() {
  const { data: session } = useSession();
  const { geminiConfig } = useChatStore();
  const { preferences, updatePreferences, showToast } = useUIStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Fetch user's progress data
      const response = await fetch('/api/user-stats');
      if (response.ok) {
        const data = await response.json();
        const exportData = {
          exportDate: new Date().toISOString(),
          user: session?.user,
          stats: data,
          preferences: preferences,
        };
        
        // Create download link
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prepmatrix-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('success', 'Data exported successfully');
      } else {
        showToast('error', 'Failed to export data');
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('error', 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetData = async () => {
    if (!confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
      return;
    }
    
    if (!confirm('This will permanently delete all your progress, stats, and preferences. Are you absolutely sure?')) {
      return;
    }

    setIsResetting(true);
    try {
      // Clear local storage
      localStorage.clear();
      
      // Reset preferences to defaults
      updatePreferences({
        showCharts: true,
        compactCards: false,
        autoRevealRationale: false,
        keyboardShortcuts: true,
        soundEffects: true,
        notifications: true,
      });
      
      showToast('success', 'All data has been reset');
      
      // Reload page after a short delay
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Reset error:', error);
      showToast('error', 'Failed to reset data');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-strong)' }}>
            Account Information
          </h2>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Name</label>
            <p className="text-base font-medium" style={{ color: 'var(--text-strong)' }}>{session?.user?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Email</label>
            <p className="text-base font-medium" style={{ color: 'var(--text-strong)' }}>{session?.user?.email || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-strong)' }}>
            Learning Preferences
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <label className="font-medium block" style={{ color: 'var(--text-strong)' }}>
                Auto-reveal Explanation
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Automatically show explanation after submitting answer
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.autoRevealRationale}
              onChange={(e) => updatePreferences({ autoRevealRationale: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <label className="font-medium block" style={{ color: 'var(--text-strong)' }}>
                Compact Cards
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Use smaller, more condensed question cards
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.compactCards}
              onChange={(e) => updatePreferences({ compactCards: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <label className="font-medium block" style={{ color: 'var(--text-strong)' }}>
                Sound Effects
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Play sounds for correct/incorrect answers
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.soundEffects}
              onChange={(e) => updatePreferences({ soundEffects: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>
        </div>
      </div>

      {/* Display & Interface */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-strong)' }}>
            Display & Interface
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <label className="font-medium block" style={{ color: 'var(--text-strong)' }}>
                Show Analytics Charts
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Display visual analytics and progress charts on dashboard
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.showCharts}
              onChange={(e) => updatePreferences({ showCharts: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>
        </div>
      </div>

      {/* Keyboard & Accessibility */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-strong)' }}>
            Keyboard & Accessibility
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <label className="font-medium block" style={{ color: 'var(--text-strong)' }}>
                Keyboard Shortcuts
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Enable keyboard navigation (1-4 for options, Enter to submit, N/P for navigation)
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.keyboardShortcuts}
              onChange={(e) => updatePreferences({ keyboardShortcuts: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-strong)' }}>
            Notifications
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <label className="font-medium block" style={{ color: 'var(--text-strong)' }}>
                Enable Notifications
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Receive in-app notifications for achievements and reminders
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => updatePreferences({ notifications: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-strong)' }}>
            Data Management
          </h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex-1">
              <label className="font-medium block mb-1" style={{ color: 'var(--text-strong)' }}>
                Export Progress Data
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Download all your progress, stats, and preferences as JSON
              </p>
            </div>
            <button 
              onClick={handleExportData}
              disabled={isExporting}
              className="btn btn-secondary flex items-center gap-2 ml-4 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border-2" style={{ borderColor: '#dc2626', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
            <div className="flex-1">
              <label className="font-medium block mb-1" style={{ color: '#dc2626' }}>
                Reset All Data
              </label>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Permanently delete all progress, preferences, and local data
              </p>
            </div>
            <button 
              onClick={handleResetData}
              disabled={isResetting}
              className="btn btn-danger flex items-center gap-2 ml-4 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isResetting ? 'Resetting...' : 'Reset'}
            </button>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="card p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-center space-y-2">
          <h3 className="font-semibold" style={{ color: 'var(--text-strong)' }}>PrepMatrix</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Version 1.0.0 • AI-Powered Interview Preparation Platform
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 PrepMatrix. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
