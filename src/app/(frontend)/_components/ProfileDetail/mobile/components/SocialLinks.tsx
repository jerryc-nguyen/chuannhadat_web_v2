'use client';
import React from 'react';
import Link from 'next/link';
import { MoreHorizontal as BsThreeDots } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';

interface SocialLinksProps {
  profileData?: {
    facebook_url?: string;
    youtube_url?: string;
  };
}

const SocialLinks: React.FC<SocialLinksProps> = ({ profileData }) => {
  // Don't render if no social links are available
  if (!profileData?.facebook_url && !profileData?.youtube_url) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="block h-full rounded-md bg-slate-100 p-3">
        <BsThreeDots />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Liên kết</DropdownMenuLabel>
        {profileData?.facebook_url && (
          <DropdownMenuItem>
            <Link
              target="_blank"
              href={profileData.facebook_url}
              className="text-xs text-secondary hover:text-black"
            >
              Link facebook
            </Link>
          </DropdownMenuItem>
        )}
        {profileData?.youtube_url && (
          <DropdownMenuItem>
            <Link
              target="_blank"
              href={profileData.youtube_url}
              className="text-xs text-secondary hover:text-black"
            >
              Link youtube
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialLinks;
