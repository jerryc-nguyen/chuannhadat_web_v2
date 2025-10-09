import React from 'react';
import { X } from 'lucide-react';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../../../constants';

interface LoadingStateProps {
  position?: 'left' | 'right';
  offsetLeft?: number;
  onClose?: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  position = 'left',
  offsetLeft = 0,
  onClose
}) => {
  const positionStyles = {
    width: SEARCH_BOX_WIDTH_WITH_PADDING,
    height: '100vh',
    zIndex: 1000,
    ...(position === 'left'
      ? { left: offsetLeft }
      : { right: offsetLeft }
    )
  };

  return (
    <div
      className="absolute top-0 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center"
      style={positionStyles}
    >
      {/* Close button only */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Đóng"
        >
          <X size={20} className="text-gray-500" />
        </button>
      )}

      {/* Loading content */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="mt-2 text-gray-500">Loading profile...</p>
    </div>
  );
};

export default LoadingState;
