'use client';

import React, { useLayoutEffect } from 'react';
import { X } from 'lucide-react';
import { SEARCH_BOX_WIDTH_WITH_PADDING, Z_INDEX } from '../../constants';
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

  useLayoutEffect(() => {
    document.addEventListener('focusin', e => e.stopImmediatePropagation());
    document.addEventListener('focusout', e => e.stopImmediatePropagation());
  }, []);

  // Loading state
  if (isLoading) {
    return <LoadingState position={position === 'bottom' ? 'left' : position} offsetLeft={offsetLeft} onClose={onClose} />;
  }

  // Error state
  if (error || !profileData) {
    return <ErrorState position={position === 'bottom' ? 'left' : position} offsetLeft={offsetLeft} onClose={onClose} />;
  }

  // Calculate positioning styles
  const positionStyles = {
    ...(position === 'left' && {
      width: SEARCH_BOX_WIDTH_WITH_PADDING,
      height: '100vh',
      left: offsetLeft,
      zIndex: Z_INDEX.INFO_PANEL,
    }),
    ...(position === 'right' && {
      width: SEARCH_BOX_WIDTH_WITH_PADDING,
      height: '100vh',
      right: offsetLeft,
      zIndex: Z_INDEX.INFO_PANEL,
    }),
    ...(position === 'bottom' && {
      width: '100%',
      height: 'auto',
      maxHeight: '70vh',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: Z_INDEX.INFO_PANEL,
    })
  };

  return (
    <div
      className={`bg-white shadow-lg flex flex-col ${position === 'bottom'
        ? 'rounded-t-2xl'
        : 'absolute top-0 rounded-lg'
        }`}
      style={positionStyles}
    >
      {/* Close button only */}
      <button
        onClick={onClose}
        className={`p-1 hover:bg-gray-100 rounded-full transition-colors z-10 ${position === 'bottom'
          ? 'absolute top-3 right-3'
          : 'absolute top-3 right-3'
          }`}
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
