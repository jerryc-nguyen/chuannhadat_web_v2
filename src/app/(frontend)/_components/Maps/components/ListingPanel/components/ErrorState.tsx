import React from 'react';
import { X } from 'lucide-react';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../../../constants';

interface ErrorStateProps {
  onClose: () => void;
  message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onClose, message = 'Unable to load listings' }) => {
  return (
    <div
      className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col"
      style={{ width: SEARCH_BOX_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Error</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
};

export default ErrorState;
