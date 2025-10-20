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

  const [panelTitle, setPanelTitle] = useState<string>('Danh sách môi giới');
  const [totalCount, setTotalCount] = useState<number>(0);

  // Callback to receive data from child components
  const handleDataReceived = (title: string, count: number) => {
    setPanelTitle(title);
    setTotalCount(count);
  };

  const renderPanelContent = () => {
    // Route to appropriate component based on data type using type guards
    if (isLocationOption(listingOption)) {
      return (
        <ForLocationPanel
          listingOption={listingOption}
          onClose={onClose}
          onMarkerClick={onMarkerClick}
          onDataReceived={handleDataReceived}
        />
      );
    }

    if (isUserOption(listingOption)) {
      return (
        <ForUserPanel
          listingOption={listingOption}
          onClose={onClose}
          onMarkerClick={onMarkerClick}
          onDataReceived={handleDataReceived}
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
      modal={false}
      open={true}
    >
      <Drawer.Portal>
        <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[20px] shadow-lg bottom-0 left-0 right-0 h-full max-h-[95%] mx-[-1px] z-[1100] vaul-drawer-content overflow-hidden">
          <div
            className="flex flex-col max-w-md mx-auto w-full vaul-drawer-content"
            style={{
              height: snap === 1 ? '100vh' : 'auto',
              minHeight: snap !== 1 ? '300px' : 'auto'
            }}
          >
            {/* Drag handle - Google Maps style */}
            <div className="w-full flex justify-center pt-2 pb-2">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header - always sticky with flexbox */}
            <div className="flex items-center justify-between px-5 py-3 pt-0 border-b border-gray-100 flex-shrink-0 sticky top-0 bg-white z-10">
              <div className="flex flex-col">
                <Drawer.Title className="text-lg font-semibold">
                  {panelTitle}
                </Drawer.Title>
                {totalCount >= 0 && (
                  <p className="text-sm text-gray-500">{totalCount} môi giới</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 bg-gray-50 hover:bg-gray-200"
                aria-label="Đóng"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Scrollable Content Area - flex-1 takes remaining space */}
            <div 
              className="flex-1 overflow-y-auto" 
              style={{ 
                width: '100%', 
                margin: 0, 
                padding: 0,
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none; /* Chrome, Safari and Opera */
                }
              `}</style>
              {renderPanelContent()}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default ListingPanel;
