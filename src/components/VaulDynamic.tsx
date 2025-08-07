"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic imports for Vaul components
const VaulDrawer = lazy(() => import('vaul').then(mod => ({ default: mod.Drawer })));

// Loading fallback for drawer interactions
const DrawerLoader = () => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
    <div className="bg-white rounded-t-[10px] w-full h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  </div>
);

// Dynamic Drawer Root
export const DrawerRoot = (props: ComponentProps<typeof VaulDrawer.Root>) => (
  <Suspense fallback={<DrawerLoader />}>
    <VaulDrawer.Root {...props} />
  </Suspense>
);

// Dynamic Drawer Portal
export const DrawerPortal = (props: ComponentProps<typeof VaulDrawer.Portal>) => (
  <Suspense fallback={null}>
    <VaulDrawer.Portal {...props} />
  </Suspense>
);

// Dynamic Drawer Overlay  
export const DrawerOverlay = (props: ComponentProps<typeof VaulDrawer.Overlay>) => (
  <Suspense fallback={null}>
    <VaulDrawer.Overlay {...props} />
  </Suspense>
);

// Dynamic Drawer Content
export const DrawerContent = (props: ComponentProps<typeof VaulDrawer.Content>) => (
  <Suspense fallback={<DrawerLoader />}>
    <VaulDrawer.Content {...props} />
  </Suspense>
);

// Dynamic Drawer Title
export const DrawerTitle = (props: ComponentProps<typeof VaulDrawer.Title>) => (
  <Suspense fallback={null}>
    <VaulDrawer.Title {...props} />
  </Suspense>
);

// Dynamic Drawer Trigger
export const DrawerTrigger = (props: ComponentProps<typeof VaulDrawer.Trigger>) => (
  <Suspense fallback={null}>
    <VaulDrawer.Trigger {...props} />
  </Suspense>
);

// Dynamic Drawer Close
export const DrawerClose = (props: ComponentProps<typeof VaulDrawer.Close>) => (
  <Suspense fallback={null}>
    <VaulDrawer.Close {...props} />
  </Suspense>
);

// Utility function to preload Vaul when user interaction is likely
export const preloadVaul = () => {
  import('vaul');
};

// Export the dynamic Drawer object that matches Vaul's API
export const Drawer = {
  Root: DrawerRoot,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Title: DrawerTitle,
  Trigger: DrawerTrigger,
  Close: DrawerClose,
};

export default Drawer;
