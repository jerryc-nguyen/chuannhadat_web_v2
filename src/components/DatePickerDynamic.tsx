"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';
import type { DateRange } from 'react-day-picker';

// Dynamic import for react-day-picker
const DayPicker = lazy(() =>
  import('react-day-picker').then((mod) => ({ default: mod.DayPicker }))
);

// Loading fallback for date picker
const DatePickerLoader = () => (
  <div className="w-full max-w-md mx-auto">
    <div className="animate-pulse">
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="flex space-x-2">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Week days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className="h-6 bg-gray-200 rounded text-center text-xs"></div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Dynamic DayPicker component
export const DayPickerDynamic = (props: ComponentProps<typeof DayPicker>) => (
  <Suspense fallback={<DatePickerLoader />}>
    <DayPicker {...props} />
  </Suspense>
);

// Note: Using DateRange type from react-day-picker
// No need to define custom interface - using imported one

// Dynamic date range picker
export const DateRangePickerDynamic = ({
  selected,
  onSelect,
  numberOfMonths = 2,
  ...props
}: {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  numberOfMonths?: number;
}) => (
  <Suspense fallback={<DatePickerLoader />}>
    <DayPicker
      mode="range"
      selected={selected}
      onSelect={onSelect}
      numberOfMonths={numberOfMonths}
      {...props}
    />
  </Suspense>
);

// Single date picker
export const SingleDatePickerDynamic = ({
  selected,
  onSelect,
  ...props
}: {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}) => (
  <Suspense fallback={<DatePickerLoader />}>
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      {...props}
    />
  </Suspense>
);

// Utility function to preload date picker
export const preloadDatePicker = () => {
  import('react-day-picker');
};

// Hook for dynamic date picker usage
export const useDatePickerDynamic = () => {
  return {
    preload: preloadDatePicker,
    DayPicker: DayPickerDynamic,
    DateRangePicker: DateRangePickerDynamic,
    SingleDatePicker: SingleDatePickerDynamic
  };
};

export default DayPickerDynamic;

// Re-export DateRange type for convenience
export type { DateRange };
