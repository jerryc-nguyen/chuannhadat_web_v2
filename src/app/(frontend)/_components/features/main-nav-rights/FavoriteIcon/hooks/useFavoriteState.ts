import { useState } from 'react';
import { OptionForSelect } from '@common/types';
import { VIEW_OPTIONS } from '../types';

/**
 * Hook for managing favorite component state
 * Handles open/close state, selected tab, and loading states
 */
export const useFavoriteState = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<OptionForSelect>(VIEW_OPTIONS[0]);
  const [loadingDeleteUid, setLoadingDeleteUid] = useState<string>('');

  return {
    isOpen,
    setIsOpen,
    selectedTab,
    setSelectedTab,
    loadingDeleteUid,
    setLoadingDeleteUid,
  };
};
