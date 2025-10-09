import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">No listings found</p>
    </div>
  );
};

export default EmptyState;
