'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Drawer } from 'vaul';
import { ListingPanelProps, isLocationOption, isUserOption } from '../types';
import { ForLocationPanel } from '../components/ForLocation';
import { ForUserPanel } from '../components/ForUser';

const snapPoints = ['400px', 1];

const ListingPanel: React.FC<ListingPanelProps> = ({
  listingOption,
  onClose,
  onMarkerClick,
}) => {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  // Update snap point when content loads
  useEffect(() => {
    // Set initial snap point
    setSnap(snapPoints[0]);
  }, []);

  const renderPanelContent = () => {
    // Route to appropriate component based on data type using type guards
    if (isLocationOption(listingOption)) {
      return (
        <ForLocationPanel
          listingOption={listingOption}
          onClose={onClose}
          onMarkerClick={onMarkerClick}
        />
      );
    }

    if (isUserOption(listingOption)) {
      return (
        <ForUserPanel
          listingOption={listingOption}
          onClose={onClose}
          onMarkerClick={onMarkerClick}
        />
      );
    }

    // Fallback for unknown data types
    console.error('Unknown data_type:', listingOption.data_type);
    return (
      <div className="p-4">
        <p>Error: Unknown listing type</p>
        <button onClick={onClose} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
          Close
        </button>
      </div>
    );
  };

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
        <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[95%] mx-[-1px] z-[1100] vaul-drawer-content">
          <div
            className="flex flex-col max-w-md mx-auto w-full"
            style={{
              height: snap === 1 ? '100vh' : 'auto',
              minHeight: snap !== 1 ? '300px' : 'auto'
            }}
          >
            {/* Header - always sticky with flexbox */}
            <div className="flex items-center justify-between p-4 pt-5 pb-4 border-b border-gray-100 flex-shrink-0 sticky top-0 bg-white z-10">
              <Drawer.Title className="text-lg font-semibold">
                Danh sách môi giới
              </Drawer.Title>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Đóng"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content Area - flex-1 takes remaining space */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {renderPanelContent()}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default ListingPanel;
