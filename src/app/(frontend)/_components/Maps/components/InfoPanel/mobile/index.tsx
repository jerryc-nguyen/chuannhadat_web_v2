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
import { Z_INDEX } from '../../../constants';

const snapPoints = ['400px', 1];

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
      modal={false}
      open={true}
    >
      <Drawer.Portal>
        <Drawer.Content className={`fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] z-[${Z_INDEX.INFO_PANEL}] vaul-drawer-content`}>
          <div
            className="flex flex-col max-w-md mx-auto w-full vaul-drawer-content"
            style={{
              height: snap === 1 ? '100vh' : 'auto',
              minHeight: snap !== 1 ? '200px' : 'auto'
            }}
          >
            {/* Header - always sticky with flexbox */}
            <div className={`flex items-center justify-between p-4 pt-5 pb-4 border-b border-gray-100 flex-shrink-0 sticky top-0 bg-white z-[${Z_INDEX.STICKY_HEADER}]`}>
              <Drawer.Title className="text-lg font-semibold">
                Thông tin địa điểm
              </Drawer.Title>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 bg-gray-50 hover:bg-gray-200"
                aria-label="Đóng"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Scrollable Content Area - flex-1 takes remaining space */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
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
