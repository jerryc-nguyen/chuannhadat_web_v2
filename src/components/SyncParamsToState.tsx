"use client";

import { useSyncParamsToState } from '@hooks/useSyncParamsToState';

const SyncParamsToState = () => {
  useSyncParamsToState();
  return null; // If it doesn't render anything, return null.
};

export default SyncParamsToState;
