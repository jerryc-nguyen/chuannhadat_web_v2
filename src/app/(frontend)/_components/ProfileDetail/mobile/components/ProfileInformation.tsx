'use client';
import React from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import ButtonPhone from '@components/button-phone';

interface ProfileInformationProps {
  profileData?: {
    full_name?: string;
    profile_tags?: string[];
    job_title?: string;
    description?: string;
    address?: string;
    posts_count?: number;
    facebook_url?: string;
    youtube_url?: string;
    phone?: string;
  };
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({ profileData }) => {
  return (
    <div className="bg-white px-4 pb-6">
      {/* Name and Social Links */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {profileData?.job_title && (
            <div className="flex items-center text-gray-600 mb-2">
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="text-sm">{profileData.job_title}</span>
            </div>
          )}
          {profileData?.address && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{profileData.address}</span>
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
      <div className="flex gap-3">
        {profileData?.phone && (
          <ButtonPhone
            isCall={true}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            phoneNumberProfile={profileData.phone}
          />
        )}
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
          Nhắn tin
        </button>
      </div>
    </div>
  );
};

export default ProfileInformation;
