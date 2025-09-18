'use client';
import React, { useState } from 'react';
import { useIsMobile } from '@common/hooks';
import FavoriteIconMobile from './FavoriteIconMobile';
import FavoriteIconDesktop from './FavoriteIconDesktop';

type FavoriteIconProps = object;

const FavoriteIcon: React.FC<FavoriteIconProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return <FavoriteIconMobile isOpen={isOpen} onOpenChange={setIsOpen} />;
  }

  return <FavoriteIconDesktop isOpen={isOpen} onOpenChange={setIsOpen} />;
};

export default FavoriteIcon;
