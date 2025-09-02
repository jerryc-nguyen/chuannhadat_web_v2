"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic imports for Drag & Drop components
const DragDropContext = lazy(() =>
  import('@hello-pangea/dnd').then((mod) => ({ default: mod.DragDropContext }))
);

const Droppable = lazy(() =>
  import('@hello-pangea/dnd').then((mod) => ({ default: mod.Droppable }))
);

const Draggable = lazy(() =>
  import('@hello-pangea/dnd').then((mod) => ({ default: mod.Draggable }))
);

// Loading fallback for drag and drop operations
const DragDropLoader = ({ children }: { children?: React.ReactNode }) => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-24 h-24 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
    {children}
  </div>
);

// Dynamic DragDropContext
export const DragDropContextDynamic = (props: ComponentProps<typeof DragDropContext>) => (
  <Suspense fallback={<DragDropLoader />}>
    <DragDropContext {...props} />
  </Suspense>
);

// Dynamic Droppable
export const DroppableDynamic = (props: ComponentProps<typeof Droppable>) => (
  <Suspense fallback={<DragDropLoader />}>
    <Droppable {...props} />
  </Suspense>
);

// Dynamic Draggable
export const DraggableDynamic = (props: ComponentProps<typeof Draggable>) => (
  <Suspense fallback={<DragDropLoader />}>
    <Draggable {...props} />
  </Suspense>
);

// Utility function to preload drag and drop when user interaction is likely
export const preloadDragDrop = () => {
  import('@hello-pangea/dnd');
};

// Export the dynamic DragDrop object that matches @hello-pangea/dnd's API
export const DragDropDynamic = {
  DragDropContext: DragDropContextDynamic,
  Droppable: DroppableDynamic,
  Draggable: DraggableDynamic,
};

export default DragDropDynamic;
