'use client';
import React from 'react';
import { MapPin, Briefcase, CalendarDays } from 'lucide-react';
import { IUser } from '@common/types';
import Contacts from './Contacts';

interface ProfileInformationProps {
  profileData?: IUser
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({ profileData }) => {
  return (
    <div className="bg-white px-4 pb-6">
      {/* Name and Social Links */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {profileData?.job_title && (
            <div className="flex items-center text-gray-600 mb-2">
              <Briefcase className="w-[18px] h-[18px] mr-2 flex-shrink-0" />
              <span>{profileData.job_title}</span>
            </div>
          )}
          {profileData?.address && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-[18px] h-[18px] mr-2 flex-shrink-0" />
              <span>{profileData.address}</span>
            </div>
          )}
          {profileData?.formatted_joined_at && (
            <div className="flex items-center text-gray-600 mb-2">
              <CalendarDays className="w-[18px] h-[18px] mr-2 flex-shrink-0" />
              <span>{profileData.formatted_joined_at}</span>
            </div>
          )}
        </div>
      </div>


      {/* Bio/Description */}
      {profileData?.description && (
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">
            {profileData.description}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <Contacts profileData={profileData} />
    </div>
  );
};

export default ProfileInformation;
