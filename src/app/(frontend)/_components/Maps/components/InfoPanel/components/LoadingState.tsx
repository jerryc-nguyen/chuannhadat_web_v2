import React from 'react';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../../../constants';

interface LoadingStateProps {
  position?: 'left' | 'right';
  offsetLeft?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  position = 'left',
  offsetLeft = 0
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="mt-2 text-gray-500">Loading profile...</p>
    </div>
  );
};

export default LoadingState;
