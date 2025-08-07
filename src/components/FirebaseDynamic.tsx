/**
 * Dynamic Firebase Component
 * 
 * Dynamically imports Firebase (~500KB) only when authentication is needed
 * This removes Firebase from the main bundle until user interaction
 */

import { lazy, Suspense } from 'react';

// Dynamic import for Firebase auth components
const LoginSocial = lazy(() => import('@components/login-social'));

const FirebaseLoader = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
    <span className="ml-2 text-sm text-gray-600">Loading authentication...</span>
  </div>
);

interface FirebaseDynamicProps {
  children?: React.ReactNode;
}

export default function FirebaseDynamic({ children }: FirebaseDynamicProps) {
  return (
    <Suspense fallback={<FirebaseLoader />}>
      {children}
    </Suspense>
  );
}

// Export dynamic login component
export const LoginSocialDynamic = () => (
  <Suspense fallback={<FirebaseLoader />}>
    <LoginSocial />
  </Suspense>
);
