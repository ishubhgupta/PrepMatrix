'use client';

export function QuickFilters() {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
        Quick Filters
      </h2>
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-secondary text-sm">All Subjects</button>
        <button className="btn btn-ghost text-sm">Easy Questions</button>
        <button className="btn btn-ghost text-sm">Medium Questions</button>
        <button className="btn btn-ghost text-sm">Hard Questions</button>
        <button className="btn btn-ghost text-sm">Unanswered</button>
        <button className="btn btn-ghost text-sm">Incorrect</button>
      </div>
    </div>
  );
}
