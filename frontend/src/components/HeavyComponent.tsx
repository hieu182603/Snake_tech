"use client";

import { useState, useEffect } from 'react';

export function HeavyComponent() {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate heavy computation or API call
    const timer = setTimeout(() => {
      const heavyData = Array.from({ length: 100 }, (_, i) =>
        `Heavy data item ${i + 1} - ${Math.random().toString(36).substring(7)}`
      );
      setData(heavyData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Heavy Component Loaded! 🎉
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This component was lazy loaded and contains heavy data:
      </p>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {data.slice(0, 10).map((item, index) => (
          <div key={index} className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            {item}
          </div>
        ))}
        {data.length > 10 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
            ... and {data.length - 10} more items
          </div>
        )}
      </div>
    </div>
  );
}
