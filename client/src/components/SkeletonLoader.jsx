import React from 'react';

export const TestCardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden animate-pulse flex flex-col justify-between h-48">
      <div>
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export const EditorSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      {/* Editor Panel */}
      <div className="glass-card rounded-2xl p-6">
        <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-8" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Preview Panel */}
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl min-h-[600px] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
