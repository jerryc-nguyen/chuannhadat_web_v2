"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic imports for Radix DropdownMenu components
const DropdownMenuRoot = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.Root }))
);

const DropdownMenuTrigger = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.Trigger }))
);

const DropdownMenuContent = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.Content }))
);

const DropdownMenuItem = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.Item }))
);

const DropdownMenuSeparator = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.Separator }))
);

const DropdownMenuLabel = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.Label }))
);

const DropdownMenuGroup = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.Group }))
);

const DropdownMenuPortal = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.Portal }))
);

const DropdownMenuSub = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.Sub }))
);

const DropdownMenuSubContent = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.SubContent }))
);

const DropdownMenuSubTrigger = lazy(() =>
  import('@radix-ui/react-dropdown-menu').then((mod) => ({ default: mod.SubTrigger }))
);

// Loading fallback for dropdown menus
const DropdownLoader = () => (
  <div className="animate-pulse min-w-[200px] bg-white rounded-md border shadow-md p-1">
    <div className="space-y-1">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center space-x-2 px-2 py-2 rounded">
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded flex-1"></div>
        </div>
      ))}
      <div className="h-px bg-gray-200 my-1"></div>
      <div className="flex items-center space-x-2 px-2 py-2 rounded">
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

// Dynamic DropdownMenu components
export const DropdownMenuRootDynamic = (props: ComponentProps<typeof DropdownMenuRoot>) => (
  <Suspense fallback={null}>
    <DropdownMenuRoot {...props} />
  </Suspense>
);

export const DropdownMenuTriggerDynamic = (props: ComponentProps<typeof DropdownMenuTrigger>) => (
  <Suspense fallback={null}>
    <DropdownMenuTrigger {...props} />
  </Suspense>
);

export const DropdownMenuContentDynamic = (props: ComponentProps<typeof DropdownMenuContent>) => (
  <Suspense fallback={<DropdownLoader />}>
    <DropdownMenuPortal>
      <DropdownMenuContent {...props} />
    </DropdownMenuPortal>
  </Suspense>
);

export const DropdownMenuItemDynamic = (props: ComponentProps<typeof DropdownMenuItem>) => (
  <Suspense fallback={null}>
    <DropdownMenuItem {...props} />
  </Suspense>
);

export const DropdownMenuSeparatorDynamic = (props: ComponentProps<typeof DropdownMenuSeparator>) => (
  <Suspense fallback={null}>
    <DropdownMenuSeparator {...props} />
  </Suspense>
);

export const DropdownMenuLabelDynamic = (props: ComponentProps<typeof DropdownMenuLabel>) => (
  <Suspense fallback={null}>
    <DropdownMenuLabel {...props} />
  </Suspense>
);

export const DropdownMenuGroupDynamic = (props: ComponentProps<typeof DropdownMenuGroup>) => (
  <Suspense fallback={null}>
    <DropdownMenuGroup {...props} />
  </Suspense>
);

export const DropdownMenuSubDynamic = (props: ComponentProps<typeof DropdownMenuSub>) => (
  <Suspense fallback={null}>
    <DropdownMenuSub {...props} />
  </Suspense>
);

export const DropdownMenuSubTriggerDynamic = (props: ComponentProps<typeof DropdownMenuSubTrigger>) => (
  <Suspense fallback={null}>
    <DropdownMenuSubTrigger {...props} />
  </Suspense>
);

export const DropdownMenuSubContentDynamic = (props: ComponentProps<typeof DropdownMenuSubContent>) => (
  <Suspense fallback={<DropdownLoader />}>
    <DropdownMenuSubContent {...props} />
  </Suspense>
);

// Complete dropdown menu system
export const DropdownMenuDynamic = {
  Root: DropdownMenuRootDynamic,
  Trigger: DropdownMenuTriggerDynamic,
  Content: DropdownMenuContentDynamic,
  Item: DropdownMenuItemDynamic,
  Separator: DropdownMenuSeparatorDynamic,
  Label: DropdownMenuLabelDynamic,
  Group: DropdownMenuGroupDynamic,
  Sub: DropdownMenuSubDynamic,
  SubTrigger: DropdownMenuSubTriggerDynamic,
  SubContent: DropdownMenuSubContentDynamic,
};

// Simple dropdown menu component
export const SimpleDropdownDynamic = ({
  trigger,
  items,
  onItemSelect,
  ...props
}: {
  trigger: React.ReactNode;
  items: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
    separator?: boolean;
    disabled?: boolean;
  }>;
  onItemSelect?: (value: string) => void;
}) => (
  <Suspense fallback={<DropdownLoader />}>
    <DropdownMenuRoot {...props}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="min-w-[200px] bg-white rounded-md border shadow-md p-1">
          {items.map((item, index) => (
            <div key={item.value}>
              {item.separator && index > 0 && <DropdownMenuSeparator className="h-px bg-gray-200 my-1" />}
              <DropdownMenuItem
                disabled={item.disabled}
                onSelect={() => onItemSelect?.(item.value)}
                className="flex items-center space-x-2 px-2 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </Suspense>
);

// Utility function to preload dropdown menu
export const preloadDropdownMenu = () => {
  import('@radix-ui/react-dropdown-menu');
};

// Hook for dynamic dropdown menu usage
export const useDropdownMenuDynamic = () => {
  return {
    preload: preloadDropdownMenu,
    DropdownMenu: DropdownMenuDynamic,
    SimpleDropdown: SimpleDropdownDynamic
  };
};

export default DropdownMenuDynamic;
