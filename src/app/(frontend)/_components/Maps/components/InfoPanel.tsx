'use client';

import InfoCard from '@maps/components/Mappable/User/components/InfoCard';
import Contacts from '@maps/components/Mappable/User/components/Contacts';
import { useProfileData } from '@maps/components/Mappable/User/hooks';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../constants';
import { Marker } from '../types';

interface InfoPanelProps {
  marker: Marker;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  marker,
  onClose: _onClose,
}) => {
  // Lift the profile data state up to the parent
  const { profileData, imgSrc, setImgSrc, isLoading, error } = useProfileData({
    user: marker.mappable_data
  });

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center" style={{ width: SEARCH_BOX_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center" style={{ width: SEARCH_BOX_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}>
        <p className="text-gray-500">Unable to load profile data</p>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col" style={{ width: SEARCH_BOX_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <InfoCard
          profileData={profileData}
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
        />

        {/* Divider */}
        <div className="border-t border-gray-200 my-4 mb-2"></div>

        <Contacts profileData={profileData} />
      </div>

    </div>
  );
};

export default InfoPanel;
