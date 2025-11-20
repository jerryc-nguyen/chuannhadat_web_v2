'use client';
import React from 'react';
import Link from 'next/link';
import { MoreHorizontal, Facebook, Youtube } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
      <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200">
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {profileData?.facebook_url && (
          <DropdownMenuItem className="cursor-pointer">
            <Link
              target="_blank"
              href={profileData.facebook_url}
              className="flex items-center w-full text-sm text-gray-700 hover:text-gray-900"
            >
              <Facebook className="w-4 h-4 mr-3 text-blue-600" />
              Facebook
            </Link>
          </DropdownMenuItem>
        )}
        {profileData?.youtube_url && (
          <DropdownMenuItem className="cursor-pointer">
            <Link
              target="_blank"
              href={profileData.youtube_url}
              className="flex items-center w-full text-sm text-gray-700 hover:text-gray-900"
            >
              <Youtube className="w-4 h-4 mr-3 text-red-600" />
              YouTube
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialLinks;
