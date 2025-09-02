"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic imports for Sonner components
const Toaster = lazy(() =>
  import('sonner').then((mod) => ({ default: mod.Toaster }))
);

// Dynamic toast function - cannot be lazy loaded as it's a function
let toastFunction: any = null;

const loadToast = async () => {
  if (!toastFunction) {
    const mod = await import('sonner');
    toastFunction = mod.toast;
  }
  return toastFunction;
};

// Loading fallback for toaster
const ToasterLoader = () => (
  <div className="fixed top-4 right-4 z-50">
    <div className="animate-pulse bg-gray-200 rounded-lg p-3 shadow-lg">
      <div className="h-4 bg-gray-300 rounded w-32"></div>
    </div>
  </div>
);

// Dynamic Toaster component
export const ToasterDynamic = (props: ComponentProps<typeof Toaster>) => (
  <Suspense fallback={<ToasterLoader />}>
    <Toaster {...props} />
  </Suspense>
);

// Dynamic toast function wrapper
export const toastDynamic = {
  success: async (message: string, options?: any) => {
    const toast = await loadToast();
    return toast.success(message, options);
  },
  error: async (message: string, options?: any) => {
    const toast = await loadToast();
    return toast.error(message, options);
  },
  info: async (message: string, options?: any) => {
    const toast = await loadToast();
    return toast.info(message, options);
  },
  warning: async (message: string, options?: any) => {
    const toast = await loadToast();
    return toast.warning(message, options);
  },
  loading: async (message: string, options?: any) => {
    const toast = await loadToast();
    return toast.loading(message, options);
  },
  custom: async (component: React.ReactNode, options?: any) => {
    const toast = await loadToast();
    return toast.custom(component, options);
  },
  dismiss: async (id?: string | number) => {
    const toast = await loadToast();
    return toast.dismiss(id);
  },
  promise: async (promise: Promise<any>, options: any) => {
    const toast = await loadToast();
    return toast.promise(promise, options);
  }
};

// Simple toast function that loads sonner dynamically
export const showToast = async (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  const toast = await loadToast();
  return toast[type](message);
};

// Utility function to preload Sonner
export const preloadSonner = () => {
  import('sonner');
};

// Hook to use dynamic toast
export const useToastDynamic = () => {
  return {
    toast: toastDynamic,
    showToast,
    preload: preloadSonner
  };
};

export default ToasterDynamic;
