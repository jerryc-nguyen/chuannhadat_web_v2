'use client';

import React from 'react';
import { X } from 'lucide-react';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../../constants';
import { InfoPanelProps } from './types';
import { useInfoPanelData } from './hooks';
import {
  LoadingState,
  ErrorState,
  ProfileSection,
  PostsSection,
  RelatedLocationsSection,
  SectionDivider,
} from './components';

const InfoPanel: React.FC<InfoPanelProps> = ({
  marker,
  onClose,
  position = 'left',
  offsetLeft = 0
}) => {
  const {
    profileData,
    imgSrc,
    setImgSrc,
    isLoading,
    error,
    handleRelatedLocationClick,
  } = useInfoPanelData({ marker, onClose });

  // Loading state
  if (isLoading) {
    return <LoadingState position={position} offsetLeft={offsetLeft} onClose={onClose} />;
  }

  // Error state
  if (error || !profileData) {
    return <ErrorState position={position} offsetLeft={offsetLeft} onClose={onClose} />;
  }

  // Calculate positioning styles
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
      className="absolute top-0 bg-white rounded-lg shadow-lg flex flex-col"
      style={positionStyles}
    >
      {/* Close button only */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
        aria-label="Đóng"
      >
        <X size={20} className="text-gray-500" />
      </button>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Profile Section */}
        <ProfileSection
          profileData={profileData}
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
          marker={marker}
        />

        <SectionDivider />

        {/* Posts Section */}
        <PostsSection
          profileData={profileData}
          marker={marker}
        />

        <SectionDivider />

        {/* Related Locations Section */}
        <RelatedLocationsSection
          profileData={profileData}
          marker={marker}
          onItemClicked={handleRelatedLocationClick}
        />
      </div>
    </div>
  );
};

export default InfoPanel;
