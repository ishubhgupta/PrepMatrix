'use client';

export function ContentCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Chart */}
      <div className="card p-6 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50 shadow-lg">
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">
          Performance Trends
        </h3>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-200/50 dark:border-primary-800/50">
          <div className="text-center">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-secondary-600 dark:text-secondary-300">
              Chart visualization coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="card p-6 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50 shadow-lg">
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">
          Subject Breakdown
        </h3>
        <div className="space-y-4">
          {[
            { subject: 'DBMS', score: 85, color: 'blue' },
            { subject: 'GenAI', score: 92, color: 'purple' },
            { subject: 'OOPS', score: 78, color: 'green' },
            { subject: 'OS', score: 88, color: 'orange' },
            { subject: 'Python', score: 95, color: 'red' }
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-secondary-700 dark:text-secondary-300">
                  {item.subject}
                </span>
                <span className="text-sm font-bold text-secondary-900 dark:text-white">
                  {item.score}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50 shadow-lg lg:col-span-2">
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: 'Completed GenAI Quiz', time: '2 hours ago', score: '92%', icon: '🧠' },
            { action: 'Practiced DBMS Questions', time: '5 hours ago', score: '85%', icon: '🗄️' },
            { action: 'Reviewed OS Concepts', time: '1 day ago', score: '88%', icon: '💻' },
            { action: 'Python Coding Practice', time: '2 days ago', score: '95%', icon: '🐍' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-800 dark:to-primary-900/20 border border-secondary-200/30 dark:border-secondary-700/30">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{activity.icon}</div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {activity.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 dark:text-green-400">
                  {activity.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
