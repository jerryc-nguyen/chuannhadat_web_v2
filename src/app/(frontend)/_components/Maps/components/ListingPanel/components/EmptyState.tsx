import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] h-full text-center">
      <div className="flex flex-col items-center">
        <svg
          className="w-12 h-12 text-gray-300 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500 font-medium">Không tìm thấy kết quả nào</p>
      </div>
    </div>
  );
};

export default EmptyState;
