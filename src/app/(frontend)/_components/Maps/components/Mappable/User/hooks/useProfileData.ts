import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StaticImageData } from 'next/image';
import { IUser } from '@/common/types';
import { profilesApi } from '@app/(frontend)/_components/ProfileDetail/api/profiles';
import default_avatar from '@assets/images/default_avatar.png';

interface UseProfileDataProps {
  user: IUser;
}

interface UseProfileDataReturn {
  profileData: IUser | undefined;
  imgSrc: StaticImageData | string;
  setImgSrc: (src: StaticImageData | string) => void;
  isLoading: boolean;
  error: Error | null;
}

export const useProfileData = ({ user }: UseProfileDataProps): UseProfileDataReturn => {
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['get-detail-profile-map', user.slug],
    queryFn: () => profilesApi.getProfileSlug(user.slug),
    select: (data) => data.data,
  });

  const [imgSrc, setImgSrc] = useState<StaticImageData | string>(
    profileData?.avatar_url || default_avatar,
  );

  // Update image source when profile data changes
  useEffect(() => {
    if (profileData?.avatar_url) {
      setImgSrc(profileData.avatar_url);
    }
  }, [profileData?.avatar_url]);

  return {
    profileData,
    imgSrc,
    setImgSrc,
    isLoading,
    error,
  };
};
