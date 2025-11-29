import React from 'react';
import { StaticImageData } from 'next/image';
import InfoCard from '@maps/components/Mappable/User/components/InfoCard';
import Contacts from '@maps/components/Mappable/User/components/Contacts';
import { IUser } from '@common/types';
import { Marker } from '../../../types';
import SectionDivider from './SectionDivider';
import { useApp } from '@common/context/AppContext';

interface ProfileSectionProps {
  profileData: IUser;
  imgSrc: string | StaticImageData;
  setImgSrc: (src: string | StaticImageData) => void;
  marker: Marker;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profileData,
  imgSrc,
  setImgSrc,
  marker,
}) => {
  const { isMobile } = useApp();

  return (
    <>
      <InfoCard
        profileData={profileData}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        marker={marker}
      />

      {!isMobile && <SectionDivider />}

      <Contacts profileData={profileData} />
    </>
  );
};

export default ProfileSection;
