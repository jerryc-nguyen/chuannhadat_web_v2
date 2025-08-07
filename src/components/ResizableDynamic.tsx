"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic imports for react-resizable-panels
const Panel = lazy(() =>
  import('react-resizable-panels').then((mod) => ({ default: mod.Panel }))
);

const PanelGroup = lazy(() =>
  import('react-resizable-panels').then((mod) => ({ default: mod.PanelGroup }))
);

const PanelResizeHandle = lazy(() =>
  import('react-resizable-panels').then((mod) => ({ default: mod.PanelResizeHandle }))
);

// Loading fallback for resizable panels
const ResizableLoader = () => (
  <div className="flex h-full w-full">
    <div className="animate-pulse flex-1 bg-gray-200 rounded-l border-r border-gray-300">
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
    <div className="w-2 bg-gray-300 cursor-col-resize flex items-center justify-center">
      <div className="w-1 h-8 bg-gray-400 rounded"></div>
    </div>
    <div className="animate-pulse flex-1 bg-gray-200 rounded-r">
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

// Dynamic Panel component
export const PanelDynamic = (props: ComponentProps<typeof Panel>) => (
  <Suspense fallback={<ResizableLoader />}>
    <Panel {...props} />
  </Suspense>
);

// Dynamic PanelGroup component
export const PanelGroupDynamic = (props: ComponentProps<typeof PanelGroup>) => (
  <Suspense fallback={<ResizableLoader />}>
    <PanelGroup {...props} />
  </Suspense>
);

// Dynamic PanelResizeHandle component
export const PanelResizeHandleDynamic = (props: ComponentProps<typeof PanelResizeHandle>) => (
  <Suspense fallback={<div className="w-2 bg-gray-300 cursor-col-resize" />}>
    <PanelResizeHandle {...props} />
  </Suspense>
);

// Complete resizable panels system
export const ResizablePanelsDynamic = {
  Panel: PanelDynamic,
  PanelGroup: PanelGroupDynamic,
  PanelResizeHandle: PanelResizeHandleDynamic,
};

// Simple two-panel layout
export const TwoPanelLayoutDynamic = ({
  leftPanel,
  rightPanel,
  direction = "horizontal",
  defaultSizes = [50, 50],
  ...props
}: {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  direction?: "horizontal" | "vertical";
  defaultSizes?: number[];
}) => (
  <Suspense fallback={<ResizableLoader />}>
    <PanelGroup direction={direction} {...props}>
      <Panel defaultSize={defaultSizes[0]}>
        {leftPanel}
      </Panel>
      <PanelResizeHandle />
      <Panel defaultSize={defaultSizes[1]}>
        {rightPanel}
      </Panel>
    </PanelGroup>
  </Suspense>
);

// Utility function to preload resizable panels
export const preloadResizablePanels = () => {
  import('react-resizable-panels');
};

// Hook for dynamic resizable panels usage
export const useResizablePanelsDynamic = () => {
  return {
    preload: preloadResizablePanels,
    Panel: PanelDynamic,
    PanelGroup: PanelGroupDynamic,
    PanelResizeHandle: PanelResizeHandleDynamic,
    TwoPanelLayout: TwoPanelLayoutDynamic
  };
};

export default ResizablePanelsDynamic;
