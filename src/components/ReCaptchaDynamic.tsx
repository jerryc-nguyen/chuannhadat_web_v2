"use client";

import React, { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic import for react-google-recaptcha
const ReCAPTCHA = lazy(() =>
  import('react-google-recaptcha').then((mod) => ({ default: mod.default }))
);

// Loading fallback for reCAPTCHA
const ReCaptchaLoader = () => (
  <div className="flex items-center justify-center p-4 border border-gray-300 rounded bg-gray-50">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      <span className="text-sm text-gray-600">Loading reCAPTCHA...</span>
    </div>
  </div>
);

// Dynamic ReCAPTCHA component
export const ReCAPTCHADynamic = (props: ComponentProps<typeof ReCAPTCHA>) => (
  <Suspense fallback={<ReCaptchaLoader />}>
    <ReCAPTCHA {...props} />
  </Suspense>
);

// Utility function to preload reCAPTCHA when form is likely to be submitted
export const preloadReCaptcha = () => {
  import('react-google-recaptcha');
};

// Smart reCAPTCHA wrapper with preloading
export const SmartReCAPTCHA = ({
  sitekey,
  onChange,
  onExpired,
  onErrored,
  ...props
}: ComponentProps<typeof ReCAPTCHA>) => {
  // Preload reCAPTCHA when component mounts
  React.useEffect(() => {
    preloadReCaptcha();
  }, []);

  return (
    <Suspense fallback={<ReCaptchaLoader />}>
      <ReCAPTCHA
        sitekey={sitekey}
        onChange={onChange}
        onExpired={onExpired}
        onErrored={onErrored}
        {...props}
      />
    </Suspense>
  );
};

export default ReCAPTCHADynamic;
