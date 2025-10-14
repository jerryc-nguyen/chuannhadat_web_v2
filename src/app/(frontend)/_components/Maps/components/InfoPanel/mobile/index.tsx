'use client';

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
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

const snapPoints = ['148px', '355px', 1];

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

  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  // Update snap point when content loads
  useEffect(() => {
    if (!isLoading && !error && profileData) {
      // Content loaded - use full snap points
      setSnap(snapPoints[0]); // Start at first snap point
    }
  }, [isLoading, error, profileData]);

  return (
    <Drawer.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      snapToSequentialPoint
      shouldScaleBackground
      open={true}
      onOpenChange={(open: boolean) => !open && onClose()}
      onClose={onClose}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] z-[1200]">
          <div
            className={clsx('flex flex-col max-w-md mx-auto w-full p-4 pt-5', {
              'overflow-y-auto': snap === 1,
              'overflow-hidden': snap !== 1,
            })}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
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
            <div className="flex-1">
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
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default InfoPanel;
