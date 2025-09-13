"use client";

import { useSyncParamsToState } from '@common/hooks/useSyncParamsToState';

const SyncParamsToState = () => {
  useSyncParamsToState();
  return null; // If it doesn't render anything, return null.
};

export default SyncParamsToState;
