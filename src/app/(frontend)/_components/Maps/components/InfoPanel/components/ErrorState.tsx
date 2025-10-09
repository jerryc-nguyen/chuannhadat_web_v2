import React from 'react';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../../../constants';

interface ErrorStateProps {
  message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to load profile data'
}) => {
  return (
    <div
      className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center"
      style={{ width: SEARCH_BOX_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}
    >
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default ErrorState;
