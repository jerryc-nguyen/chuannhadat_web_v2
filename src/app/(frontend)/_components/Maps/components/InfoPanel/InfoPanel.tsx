'use client';

import React from 'react';
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

const InfoPanel: React.FC<InfoPanelProps> = ({ marker, onClose }) => {
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
    return <LoadingState />;
  }

  // Error state
  if (error || !profileData) {
    return <ErrorState />;
  }

  return (
    <div
      className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col"
      style={{ width: SEARCH_BOX_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}
    >
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
