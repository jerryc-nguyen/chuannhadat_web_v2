'use client';
import React from 'react';
import SocialLinks from './SocialLinks';

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
  };
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({ profileData }) => {
  return (
    <div className="flex flex-col gap-y-2 pl-4">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-2xl font-semibold">{profileData?.full_name}</h2>
        <SocialLinks profileData={profileData} />
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {profileData?.profile_tags?.map((item) => (
          <span
            className="text-nowrap rounded-[6px] bg-primary_color/80 px-[10px] py-1 text-xs font-semibold text-white shadow-md"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
      {(profileData?.job_title || profileData?.description) && (
        <p className="text-muted-foreground">
          {profileData?.job_title || profileData?.description}
        </p>
      )}
      {profileData?.address && <p className="text-muted-foreground">{profileData?.address}</p>}

      <div className="mb-2 flex items-center gap-x-4">
        {(profileData?.posts_count || 0) > 0 && (
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-secondary">Số bài đăng</span>
            <b>{profileData?.posts_count}</b>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInformation;
