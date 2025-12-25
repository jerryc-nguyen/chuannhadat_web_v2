"use client";

import { lazy, Suspense, useEffect } from 'react';
import type { ComponentProps } from 'react';
// @ts-ignore -- NProgress types are missing in this project configuration
import NProgress from 'nprogress';

// SSR Safety Check
const isClient = typeof window !== 'undefined';

// Loading fallback using NProgress (Top Loader)
const TopLoaderFallback = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return null;
};

// Dynamic imports for Vaul components
const DrawerRootComponent = lazy(() =>
  import('vaul').then(mod => ({ default: mod.Drawer.Root }))
);

const DrawerPortalComponent = lazy(() =>
  import('vaul').then(mod => ({ default: mod.Drawer.Portal }))
);

const DrawerOverlayComponent = lazy(() =>
  import('vaul').then(mod => ({ default: mod.Drawer.Overlay }))
);

const DrawerContentComponent = lazy(() =>
  import('vaul').then(mod => ({ default: mod.Drawer.Content }))
);

const DrawerTitleComponent = lazy(() =>
  import('vaul').then(mod => ({ default: mod.Drawer.Title }))
);

const DrawerTriggerComponent = lazy(() =>
  import('vaul').then(mod => ({ default: mod.Drawer.Trigger }))
);

const DrawerCloseComponent = lazy(() =>
  import('vaul').then(mod => ({ default: mod.Drawer.Close }))
);

const DrawerDescriptionComponent = lazy(() =>
  import('vaul').then(mod => ({ default: mod.Drawer.Description }))
);

// Dynamic Drawer Root
export const DrawerRoot = (props: ComponentProps<typeof DrawerRootComponent>) => (
  <Suspense fallback={<TopLoaderFallback />}>
    <DrawerRootComponent {...props} />
  </Suspense>
);
DrawerRoot.displayName = "DrawerRoot";

// Dynamic Drawer Portal
export const DrawerPortal = (props: ComponentProps<typeof DrawerPortalComponent>) => (
  <Suspense fallback={null}>
    <DrawerPortalComponent {...props} />
  </Suspense>
);
DrawerPortal.displayName = "DrawerPortal";

// Dynamic Drawer Overlay  
export const DrawerOverlay = (props: ComponentProps<typeof DrawerOverlayComponent>) => (
  <Suspense fallback={null}>
    <DrawerOverlayComponent {...props} />
  </Suspense>
);
DrawerOverlay.displayName = "DrawerOverlay";

// Dynamic Drawer Content
export const DrawerContent = (props: ComponentProps<typeof DrawerContentComponent>) => (
  <Suspense fallback={<TopLoaderFallback />}>
    <DrawerContentComponent {...props} />
  </Suspense>
);
DrawerContent.displayName = "DrawerContent";

// Dynamic Drawer Title
export const DrawerTitle = (props: ComponentProps<typeof DrawerTitleComponent>) => (
  <Suspense fallback={null}>
    <DrawerTitleComponent {...props} />
  </Suspense>
);
DrawerTitle.displayName = "DrawerTitle";

// Dynamic Drawer Trigger
export const DrawerTrigger = (props: ComponentProps<typeof DrawerTriggerComponent>) => (
  <Suspense fallback={null}>
    <DrawerTriggerComponent {...props} />
  </Suspense>
);
DrawerTrigger.displayName = "DrawerTrigger";

// Dynamic Drawer Close
export const DrawerClose = (props: ComponentProps<typeof DrawerCloseComponent>) => (
  <Suspense fallback={null}>
    <DrawerCloseComponent {...props} />
  </Suspense>
);
DrawerClose.displayName = "DrawerClose";

// Dynamic Drawer Description
export const DrawerDescription = (props: ComponentProps<typeof DrawerDescriptionComponent>) => (
  <Suspense fallback={null}>
    <DrawerDescriptionComponent {...props} />
  </Suspense>
);
DrawerDescription.displayName = "DrawerDescription";

// Utility function to preload Vaul when user interaction is likely
export const preloadVaul = () => {
  if (isClient) {
    import('vaul');
  }
};

// Export the dynamic Drawer object that matches Vaul's API
export const Drawer = {
  Root: DrawerRoot,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Trigger: DrawerTrigger,
  Close: DrawerClose,
};

export default Drawer;
