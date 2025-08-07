"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic imports for various Radix Menu components

// Context Menu
const ContextMenuRoot = lazy(() =>
  import('@radix-ui/react-context-menu').then((mod) => ({ default: mod.Root }))
);

const ContextMenuTrigger = lazy(() =>
  import('@radix-ui/react-context-menu').then((mod) => ({ default: mod.Trigger }))
);

const ContextMenuContent = lazy(() =>
  import('@radix-ui/react-context-menu').then((mod) => ({ default: mod.Content }))
);

const ContextMenuItem = lazy(() =>
  import('@radix-ui/react-context-menu').then((mod) => ({ default: mod.Item }))
);

const ContextMenuSeparator = lazy(() =>
  import('@radix-ui/react-context-menu').then((mod) => ({ default: mod.Separator }))
);

// Menubar
const MenubarRoot = lazy(() =>
  import('@radix-ui/react-menubar').then((mod) => ({ default: mod.Root }))
);

const MenubarMenu = lazy(() =>
  import('@radix-ui/react-menubar').then((mod) => ({ default: mod.Menu }))
);

const MenubarTrigger = lazy(() =>
  import('@radix-ui/react-menubar').then((mod) => ({ default: mod.Trigger }))
);

const MenubarContent = lazy(() =>
  import('@radix-ui/react-menubar').then((mod) => ({ default: mod.Content }))
);

const MenubarItem = lazy(() =>
  import('@radix-ui/react-menubar').then((mod) => ({ default: mod.Item }))
);

// Alert Dialog
const AlertDialogRoot = lazy(() =>
  import('@radix-ui/react-alert-dialog').then((mod) => ({ default: mod.Root }))
);

const AlertDialogTrigger = lazy(() =>
  import('@radix-ui/react-alert-dialog').then((mod) => ({ default: mod.Trigger }))
);

const AlertDialogContent = lazy(() =>
  import('@radix-ui/react-alert-dialog').then((mod) => ({ default: mod.Content }))
);

const AlertDialogTitle = lazy(() =>
  import('@radix-ui/react-alert-dialog').then((mod) => ({ default: mod.Title }))
);

const AlertDialogDescription = lazy(() =>
  import('@radix-ui/react-alert-dialog').then((mod) => ({ default: mod.Description }))
);

const AlertDialogAction = lazy(() =>
  import('@radix-ui/react-alert-dialog').then((mod) => ({ default: mod.Action }))
);

const AlertDialogCancel = lazy(() =>
  import('@radix-ui/react-alert-dialog').then((mod) => ({ default: mod.Cancel }))
);

// HoverCard
const HoverCardRoot = lazy(() =>
  import('@radix-ui/react-hover-card').then((mod) => ({ default: mod.Root }))
);

const HoverCardTrigger = lazy(() =>
  import('@radix-ui/react-hover-card').then((mod) => ({ default: mod.Trigger }))
);

const HoverCardContent = lazy(() =>
  import('@radix-ui/react-hover-card').then((mod) => ({ default: mod.Content }))
);

// Loading fallbacks
const MenuLoader = () => (
  <div className="animate-pulse min-w-[180px] bg-white rounded-md border shadow-md p-1">
    <div className="space-y-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-8 bg-gray-200 rounded px-2"></div>
      ))}
    </div>
  </div>
);

const AlertLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="fixed inset-0 bg-black/50" />
    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-pulse">
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
        <div className="flex justify-end space-x-2">
          <div className="h-9 bg-gray-300 rounded w-20"></div>
          <div className="h-9 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

const HoverLoader = () => (
  <div className="animate-pulse bg-white rounded-md border shadow-md p-4 min-w-[200px]">
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

// Context Menu Dynamic Components
export const ContextMenuDynamic = {
  Root: (props: ComponentProps<typeof ContextMenuRoot>) => (
    <Suspense fallback={null}>
      <ContextMenuRoot {...props} />
    </Suspense>
  ),
  Trigger: (props: ComponentProps<typeof ContextMenuTrigger>) => (
    <Suspense fallback={null}>
      <ContextMenuTrigger {...props} />
    </Suspense>
  ),
  Content: (props: ComponentProps<typeof ContextMenuContent>) => (
    <Suspense fallback={<MenuLoader />}>
      <ContextMenuContent {...props} />
    </Suspense>
  ),
  Item: (props: ComponentProps<typeof ContextMenuItem>) => (
    <Suspense fallback={null}>
      <ContextMenuItem {...props} />
    </Suspense>
  ),
  Separator: (props: ComponentProps<typeof ContextMenuSeparator>) => (
    <Suspense fallback={null}>
      <ContextMenuSeparator {...props} />
    </Suspense>
  ),
};

// Menubar Dynamic Components
export const MenubarDynamic = {
  Root: (props: ComponentProps<typeof MenubarRoot>) => (
    <Suspense fallback={<MenuLoader />}>
      <MenubarRoot {...props} />
    </Suspense>
  ),
  Menu: (props: ComponentProps<typeof MenubarMenu>) => (
    <Suspense fallback={null}>
      <MenubarMenu {...props} />
    </Suspense>
  ),
  Trigger: (props: ComponentProps<typeof MenubarTrigger>) => (
    <Suspense fallback={null}>
      <MenubarTrigger {...props} />
    </Suspense>
  ),
  Content: (props: ComponentProps<typeof MenubarContent>) => (
    <Suspense fallback={<MenuLoader />}>
      <MenubarContent {...props} />
    </Suspense>
  ),
  Item: (props: ComponentProps<typeof MenubarItem>) => (
    <Suspense fallback={null}>
      <MenubarItem {...props} />
    </Suspense>
  ),
};

// Alert Dialog Dynamic Components
export const AlertDialogDynamic = {
  Root: (props: ComponentProps<typeof AlertDialogRoot>) => (
    <Suspense fallback={null}>
      <AlertDialogRoot {...props} />
    </Suspense>
  ),
  Trigger: (props: ComponentProps<typeof AlertDialogTrigger>) => (
    <Suspense fallback={null}>
      <AlertDialogTrigger {...props} />
    </Suspense>
  ),
  Content: (props: ComponentProps<typeof AlertDialogContent>) => (
    <Suspense fallback={<AlertLoader />}>
      <AlertDialogContent {...props} />
    </Suspense>
  ),
  Title: (props: ComponentProps<typeof AlertDialogTitle>) => (
    <Suspense fallback={null}>
      <AlertDialogTitle {...props} />
    </Suspense>
  ),
  Description: (props: ComponentProps<typeof AlertDialogDescription>) => (
    <Suspense fallback={null}>
      <AlertDialogDescription {...props} />
    </Suspense>
  ),
  Action: (props: ComponentProps<typeof AlertDialogAction>) => (
    <Suspense fallback={null}>
      <AlertDialogAction {...props} />
    </Suspense>
  ),
  Cancel: (props: ComponentProps<typeof AlertDialogCancel>) => (
    <Suspense fallback={null}>
      <AlertDialogCancel {...props} />
    </Suspense>
  ),
};

// HoverCard Dynamic Components
export const HoverCardDynamic = {
  Root: (props: ComponentProps<typeof HoverCardRoot>) => (
    <Suspense fallback={null}>
      <HoverCardRoot {...props} />
    </Suspense>
  ),
  Trigger: (props: ComponentProps<typeof HoverCardTrigger>) => (
    <Suspense fallback={null}>
      <HoverCardTrigger {...props} />
    </Suspense>
  ),
  Content: (props: ComponentProps<typeof HoverCardContent>) => (
    <Suspense fallback={<HoverLoader />}>
      <HoverCardContent {...props} />
    </Suspense>
  ),
};

// Simple alert dialog
export const SimpleAlertDynamic = ({
  trigger,
  title,
  description,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  ...props
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) => (
  <Suspense fallback={<AlertLoader />}>
    <AlertDialogRoot {...props}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <AlertDialogTitle className="text-lg font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="mt-2 sm:mt-0 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogRoot>
  </Suspense>
);

// Utility functions
export const preloadContextMenu = () => import('@radix-ui/react-context-menu');
export const preloadMenubar = () => import('@radix-ui/react-menubar');
export const preloadAlertDialog = () => import('@radix-ui/react-alert-dialog');
export const preloadHoverCard = () => import('@radix-ui/react-hover-card');

export const preloadAllMenus = () => {
  preloadContextMenu();
  preloadMenubar();
  preloadAlertDialog();
  preloadHoverCard();
};

// Hook for dynamic menu usage
export const useMenusDynamic = () => {
  return {
    ContextMenu: ContextMenuDynamic,
    Menubar: MenubarDynamic,
    AlertDialog: AlertDialogDynamic,
    HoverCard: HoverCardDynamic,
    SimpleAlert: SimpleAlertDynamic,
    preload: preloadAllMenus
  };
};

export default {
  ContextMenu: ContextMenuDynamic,
  Menubar: MenubarDynamic,
  AlertDialog: AlertDialogDynamic,
  HoverCard: HoverCardDynamic,
};
