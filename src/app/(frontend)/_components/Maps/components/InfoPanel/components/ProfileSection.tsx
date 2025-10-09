import React from 'react';
import { StaticImageData } from 'next/image';
import InfoCard from '@maps/components/Mappable/User/components/InfoCard';
import Contacts from '@maps/components/Mappable/User/components/Contacts';
import { IUser } from '@common/types';
import { Marker } from '../../../types';
import SectionDivider from './SectionDivider';

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
  return (
    <>
      <InfoCard
        profileData={profileData}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        marker={marker}
      />

      <SectionDivider />

      <Contacts profileData={profileData} />
    </>
  );
};

export default ProfileSection;
