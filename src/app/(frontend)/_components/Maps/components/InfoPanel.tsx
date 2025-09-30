'use client';


import InfoCard from '@maps/components/Mappable/User/InfoCard';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../constants';
import { Marker } from '../types';

interface InfoPanelProps {
  marker: Marker;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  marker,
  onClose,
}) => {

  return (
    <div className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col" style={{ width: SEARCH_BOX_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <InfoCard user={marker.mappable_data} />
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex gap-3 mt-6 p-6 pt-4 border-t border-gray-100 flex-shrink-0">
        Footer
      </div>
    </div>
  );
};

export default InfoPanel;
