'use client';
import React from 'react';
import { useMapFilterLabels } from '@maps/hooks/useMapFilterLabels';

const ActivePostFilters: React.FC = () => {
  const activeFilters = useMapFilterLabels();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {activeFilters.map(filter => (
        <div
          key={filter.value}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
};

export default ActivePostFilters;
