"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic imports for cmdk components
const Command = lazy(() =>
  import('cmdk').then((mod) => ({ default: mod.Command }))
);

const CommandInput = lazy(() =>
  import('cmdk').then((mod) => ({ default: mod.Command.Input }))
);

const CommandList = lazy(() =>
  import('cmdk').then((mod) => ({ default: mod.Command.List }))
);

const CommandEmpty = lazy(() =>
  import('cmdk').then((mod) => ({ default: mod.Command.Empty }))
);

const CommandGroup = lazy(() =>
  import('cmdk').then((mod) => ({ default: mod.Command.Group }))
);

const CommandItem = lazy(() =>
  import('cmdk').then((mod) => ({ default: mod.Command.Item }))
);

// Loading fallback for command palette
const CommandLoader = () => (
  <div className="flex h-full w-full max-w-sm mx-auto">
    <div className="animate-pulse w-full bg-white rounded-lg border shadow-md">
      {/* Search input */}
      <div className="border-b p-3">
        <div className="h-9 bg-gray-200 rounded"></div>
      </div>

      {/* Command list */}
      <div className="p-2">
        <div className="space-y-1">
          {/* Group header */}
          <div className="px-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>

          {/* Command items */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-2 px-2 py-2 rounded">
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Dynamic Command components
export const CommandDynamic = (props: ComponentProps<typeof Command>) => (
  <Suspense fallback={<CommandLoader />}>
    <Command {...props} />
  </Suspense>
);

export const CommandInputDynamic = (props: ComponentProps<typeof CommandInput>) => (
  <Suspense fallback={null}>
    <CommandInput {...props} />
  </Suspense>
);

export const CommandListDynamic = (props: ComponentProps<typeof CommandList>) => (
  <Suspense fallback={null}>
    <CommandList {...props} />
  </Suspense>
);

export const CommandEmptyDynamic = (props: ComponentProps<typeof CommandEmpty>) => (
  <Suspense fallback={null}>
    <CommandEmpty {...props} />
  </Suspense>
);

export const CommandGroupDynamic = (props: ComponentProps<typeof CommandGroup>) => (
  <Suspense fallback={null}>
    <CommandGroup {...props} />
  </Suspense>
);

export const CommandItemDynamic = (props: ComponentProps<typeof CommandItem>) => (
  <Suspense fallback={null}>
    <CommandItem {...props} />
  </Suspense>
);

// Command palette with search
export const CommandPaletteDynamic = ({
  placeholder = "Search...",
  children,
  ...props
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) => (
  <Suspense fallback={<CommandLoader />}>
    <Command className="rounded-lg border shadow-md" {...props}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {children}
      </CommandList>
    </Command>
  </Suspense>
);

// Search combobox component
export const SearchComboboxDynamic = ({
  items,
  placeholder = "Search items...",
  onSelect,
  ...props
}: {
  items: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  placeholder?: string;
  onSelect?: (value: string) => void;
}) => (
  <Suspense fallback={<CommandLoader />}>
    <Command className="rounded-lg border shadow-md max-w-sm" {...props}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No items found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={() => onSelect?.(item.value)}
              className="flex items-center space-x-2 px-2 py-2"
            >
              {item.icon}
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </Suspense>
);

// Utility function to preload cmdk
export const preloadCommand = () => {
  import('cmdk');
};

// Complete command system
export const CmdkDynamic = {
  Command: CommandDynamic,
  Input: CommandInputDynamic,
  List: CommandListDynamic,
  Empty: CommandEmptyDynamic,
  Group: CommandGroupDynamic,
  Item: CommandItemDynamic,
};

// Hook for dynamic command usage
export const useCommandDynamic = () => {
  return {
    preload: preloadCommand,
    Command: CommandDynamic,
    Input: CommandInputDynamic,
    List: CommandListDynamic,
    Empty: CommandEmptyDynamic,
    Group: CommandGroupDynamic,
    Item: CommandItemDynamic,
    CommandPalette: CommandPaletteDynamic,
    SearchCombobox: SearchComboboxDynamic
  };
};

export default CommandDynamic;
