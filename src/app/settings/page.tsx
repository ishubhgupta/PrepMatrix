import { Header } from '@/components/layout/Header';
import { SettingsForm } from '@/components/settings/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Configure your preferences and AI features
          </p>
        </div>

        <SettingsForm />
      </main>
    </div>
  );
}
