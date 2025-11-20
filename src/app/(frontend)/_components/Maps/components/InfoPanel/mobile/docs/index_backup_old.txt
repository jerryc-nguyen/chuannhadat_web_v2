'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Drawer } from 'vaul';
import { InfoPanelProps } from '../types';
import { useInfoPanelData } from '../hooks';
import {
  ProfileSection,
  PostsSection,
  RelatedLocationsSection,
  SectionDivider,
} from '../components';

const InfoPanel: React.FC<InfoPanelProps> = ({
  marker,
  onClose,
}) => {
  const {
    profileData,
    imgSrc,
    setImgSrc,
    isLoading,
    error,
    handleRelatedLocationClick,
  } = useInfoPanelData({ marker, onClose });

  // State for managing snap points based on content loading
  const [snapPoints, setSnapPoints] = useState<string[]>(['0.25']);

  // Update snap points when content loads
  useEffect(() => {
    if (isLoading) {
      // Loading state: minimal height
      setSnapPoints(['0.25']);
    } else if (error || !profileData) {
      // Error state: minimal height
      setSnapPoints(['0.25']);
    } else {
      // Content loaded: full snap points
      console.log('Content loaded: full snap points');
      setTimeout(() => { setSnapPoints(['148px', '355px', '1']); }, 2000);

    }
  }, [isLoading, error, profileData]);

  return (
    <Drawer.Root
      shouldScaleBackground
      open={true}
      onOpenChange={(open: boolean) => !open && onClose()}
      onClose={onClose}
      repositionInputs={false}
      snapPoints={snapPoints}
      modal={false}
      dismissible={true}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[1100]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px] bg-white z-[1200]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Drawer.Title className="text-lg font-semibold">Thông tin địa điểm</Drawer.Title>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Đóng"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto p-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error || !profileData ? (
              <div className="flex items-center justify-center h-40 text-red-500">
                <p>Không thể tải thông tin</p>
              </div>
            ) : (
              <div>
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
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default InfoPanel;
