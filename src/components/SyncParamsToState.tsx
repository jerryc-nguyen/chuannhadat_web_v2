"use client";

import { useSyncParamsToState } from '@frontend/features/search/hooks/useSyncParamsToState';

const SyncParamsToState = () => {
  useSyncParamsToState();
  return null; // If it doesn't render anything, return null.
};

export default SyncParamsToState;
