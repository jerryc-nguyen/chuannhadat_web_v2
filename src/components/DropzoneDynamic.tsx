"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic import for react-dropzone
const ReactDropzone = lazy(() =>
  import('react-dropzone').then((mod) => ({ default: mod.default }))
);

const useDropzone = lazy(() =>
  import('react-dropzone').then((mod) => ({ default: mod.useDropzone }))
);

// Loading fallback for file upload
const DropzoneLoader = () => (
  <div className="flex items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
      <p className="mb-2 text-sm text-gray-500">
        <span className="font-semibold">Loading upload area...</span>
      </p>
      <p className="text-xs text-gray-500">Please wait while we prepare the file upload</p>
    </div>
  </div>
);

// Dynamic Dropzone component
export const DropzoneDynamic = (props: any) => (
  <Suspense fallback={<DropzoneLoader />}>
    <ReactDropzone {...props} />
  </Suspense>
);

// Hook wrapper for useDropzone
export const useDropzoneDynamic = () => {
  return useDropzone;
};

// Utility function to preload dropzone when user hovers over upload area
export const preloadDropzone = () => {
  import('react-dropzone');
};

// Simple file upload component with dynamic loading
export const FileUploadDynamic = ({ onDrop, accept, multiple = true, ...props }: {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  children?: React.ReactNode;
}) => (
  <Suspense fallback={<DropzoneLoader />}>
    <ReactDropzone onDrop={onDrop} accept={accept} multiple={multiple} {...props} />
  </Suspense>
);

export default DropzoneDynamic;
