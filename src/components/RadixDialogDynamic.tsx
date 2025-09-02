"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic imports for Radix Dialog components
const DialogRoot = lazy(() =>
  import('@radix-ui/react-dialog').then((mod) => ({ default: mod.Root }))
);

const DialogTrigger = lazy(() =>
  import('@radix-ui/react-dialog').then((mod) => ({ default: mod.Trigger }))
);

const DialogPortal = lazy(() =>
  import('@radix-ui/react-dialog').then((mod) => ({ default: mod.Portal }))
);

const DialogOverlay = lazy(() =>
  import('@radix-ui/react-dialog').then((mod) => ({ default: mod.Overlay }))
);

const DialogContent = lazy(() =>
  import('@radix-ui/react-dialog').then((mod) => ({ default: mod.Content }))
);

const DialogHeader = lazy(() =>
  import('@radix-ui/react-dialog').then((mod) => ({ default: mod.Title }))
);

const DialogTitle = lazy(() =>
  import('@radix-ui/react-dialog').then((mod) => ({ default: mod.Title }))
);

const DialogDescription = lazy(() =>
  import('@radix-ui/react-dialog').then((mod) => ({ default: mod.Description }))
);

const DialogClose = lazy(() =>
  import('@radix-ui/react-dialog').then((mod) => ({ default: mod.Close }))
);

// Loading fallback for dialogs
const DialogLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="fixed inset-0 bg-black/50" />
    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-pulse">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t flex justify-end space-x-2">
        <div className="h-9 bg-gray-300 rounded w-20"></div>
        <div className="h-9 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Dynamic Dialog components
export const DialogRootDynamic = (props: ComponentProps<typeof DialogRoot>) => (
  <Suspense fallback={null}>
    <DialogRoot {...props} />
  </Suspense>
);

export const DialogTriggerDynamic = (props: ComponentProps<typeof DialogTrigger>) => (
  <Suspense fallback={null}>
    <DialogTrigger {...props} />
  </Suspense>
);

export const DialogContentDynamic = (props: ComponentProps<typeof DialogContent>) => (
  <Suspense fallback={<DialogLoader />}>
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent {...props} />
    </DialogPortal>
  </Suspense>
);

export const DialogHeaderDynamic = (props: ComponentProps<typeof DialogHeader>) => (
  <Suspense fallback={null}>
    <DialogHeader {...props} />
  </Suspense>
);

export const DialogTitleDynamic = (props: ComponentProps<typeof DialogTitle>) => (
  <Suspense fallback={null}>
    <DialogTitle {...props} />
  </Suspense>
);

export const DialogDescriptionDynamic = (props: ComponentProps<typeof DialogDescription>) => (
  <Suspense fallback={null}>
    <DialogDescription {...props} />
  </Suspense>
);

export const DialogCloseDynamic = (props: ComponentProps<typeof DialogClose>) => (
  <Suspense fallback={null}>
    <DialogClose {...props} />
  </Suspense>
);

// Complete dialog system
export const DialogDynamic = {
  Root: DialogRootDynamic,
  Trigger: DialogTriggerDynamic,
  Content: DialogContentDynamic,
  Header: DialogHeaderDynamic,
  Title: DialogTitleDynamic,
  Description: DialogDescriptionDynamic,
  Close: DialogCloseDynamic,
};

// Simple modal component
export const ModalDynamic = ({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  ...props
}: {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => (
  <Suspense fallback={<DialogLoader />}>
    <DialogRoot open={open} onOpenChange={onOpenChange} {...props}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
          {(title || description) && (
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              {title && (
                <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </div>
          )}
          {children}
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </Suspense>
);

// Utility function to preload Radix Dialog
export const preloadDialog = () => {
  import('@radix-ui/react-dialog');
};

// Hook for dynamic dialog usage
export const useDialogDynamic = () => {
  return {
    preload: preloadDialog,
    Dialog: DialogDynamic,
    Modal: ModalDynamic
  };
};

export default DialogDynamic;
