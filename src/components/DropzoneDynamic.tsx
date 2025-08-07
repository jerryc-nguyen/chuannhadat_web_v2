"use client";

import { lazy, Suspense, useState, useEffect } from 'react';
import type { DropzoneOptions, DropzoneState, DropzoneProps } from 'react-dropzone';

// Dynamic import for react-dropzone component
const ReactDropzone = lazy(() =>
  import('react-dropzone').then((mod) => ({ default: mod.default }))
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

// Dynamic wrapper component that uses useDropzone internally
const DropzoneWrapper = lazy(() =>
  import('react-dropzone').then((mod) => ({
    default: ({ children, ...props }: any) => {
      const { getRootProps, getInputProps, isDragActive } = mod.useDropzone(props);

      return (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {children ? children({ isDragActive, getRootProps, getInputProps }) : null}
        </div>
      );
    }
  }))
);

// Hook-like interface for dropzone functionality
export const useDropzoneDynamic = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload the dropzone module
    import('react-dropzone').then(() => setIsLoaded(true));
  }, []);

  return {
    isLoaded,
    DropzoneWrapper: ({ children, ...props }: any) => (
      <Suspense fallback={<DropzoneLoader />}>
        <DropzoneWrapper {...props}>
          {children}
        </DropzoneWrapper>
      </Suspense>
    )
  };
};

// Utility function to preload dropzone when user hovers over upload area
export const preloadDropzone = () => {
  import('react-dropzone');
};

// Simple file upload component with dynamic loading
// Usage: <FileUploadDynamic onDrop={handleDrop}>{(state) => <div>Drop zone content</div>}</FileUploadDynamic>
export const FileUploadDynamic = ({
  onDrop,
  accept,
  multiple = true,
  children,
  ...props
}: {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  children?: (state: DropzoneState) => React.ReactElement;
} & Omit<DropzoneProps, 'onDrop' | 'accept' | 'multiple' | 'children'>) => (
  <Suspense fallback={<DropzoneLoader />}>
    <ReactDropzone
      onDrop={onDrop}
      accept={accept}
      multiple={multiple}
      {...props}
    >
      {children}
    </ReactDropzone>
  </Suspense>
);

export default DropzoneDynamic;

// Re-export types for convenience
export type { DropzoneOptions, DropzoneState, DropzoneProps } from 'react-dropzone';
