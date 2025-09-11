'use client';

export function ContentCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Questions by Topic
        </h2>
        <div className="h-64 flex items-center justify-center text-secondary-500">
          Chart will be rendered here
        </div>
      </div>
      
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Difficulty Distribution
        </h2>
        <div className="h-64 flex items-center justify-center text-secondary-500">
          Chart will be rendered here
        </div>
      </div>
    </div>
  );
}
