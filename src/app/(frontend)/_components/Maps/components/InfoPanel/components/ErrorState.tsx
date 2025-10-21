import React from 'react';
import { X } from 'lucide-react';
import { SEARCH_BOX_WIDTH_WITH_PADDING, Z_INDEX } from '../../../constants';

interface ErrorStateProps {
  message?: string;
  position?: 'left' | 'right';
  offsetLeft?: number;
  onClose?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to load profile data',
  position = 'left',
  offsetLeft = 0,
  onClose
}) => {
  const positionStyles = {
    width: SEARCH_BOX_WIDTH_WITH_PADDING,
    height: '100vh',
    zIndex: Z_INDEX.INFO_PANEL,
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

      {/* Error content */}
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default ErrorState;
