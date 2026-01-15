import { Header } from '@/components/layout/Header';
import { SettingsForm } from '@/components/settings/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
            Settings
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage your learning preferences and application settings
          </p>
        </div>

        <SettingsForm />
      </main>
    </div>
  );
}
