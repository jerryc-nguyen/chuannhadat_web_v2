'use client';
import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@common/utils';

interface DualRangeSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: 'top' | 'bottom';
  heading?: string | React.ReactNode;
  showLabel?: boolean;
  formatLabel?: (value: number) => string;
  disabled?: boolean;
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>((props, ref) => {
  const {
    className,
    showLabel = false,
    labelPosition = 'top',
    heading,
    disabled = false,
    formatLabel,
    ...rest
  } = props;
  const initialValue = Array.isArray(props.value) ? props.value : [props.min, props.max];
  const formatLabelText = (value: number) => {
    return formatLabel ? formatLabel(value) : value;
  };
  return (
    <section className={cn('dual_range_slider', disabled && 'opacity-50')}>
      {heading && (
        <p className={cn('font-semibold', labelPosition === 'top' ? 'mb-10' : '')}>{heading}</p>
      )}
      <div
        className={cn(
          'flex items-center justify-center gap-x-3',
          showLabel && !heading ? (labelPosition === 'top' ? 'mt-10' : 'mb-10') : '',
        )}
      >
        <SliderPrimitive.Root
          ref={ref}
          className={cn('relative flex w-full touch-none select-none items-center', className)}
          {...rest}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#ececf0]">
            <SliderPrimitive.Range className="absolute h-full bg-primary_color" />
          </SliderPrimitive.Track>
          {initialValue.map((value, index) => (
            <React.Fragment key={index}>
              <SliderPrimitive.Thumb className="relative block h-4 w-4 rounded-full border-2 border-primary_color bg-background ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                {showLabel && (
                  <span
                    className={cn(
                      'absolute left-1/2 flex w-fit -translate-x-1/2 justify-center whitespace-nowrap rounded-sm bg-primary_color px-2 py-1 text-xs text-white',
                      labelPosition === 'top' && '-top-9',
                      labelPosition === 'bottom' && 'top-6',
                    )}
                  >
                    {formatLabelText(value as number)}
                    <div
                      className={cn(
                        'absolute left-1/2 h-0 w-0 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary_color',
                        labelPosition === 'top' ? 'bottom-[-5px]' : 'top-[-5px] rotate-180',
                      )}
                    />
                  </span>
                )}
              </SliderPrimitive.Thumb>
            </React.Fragment>
          ))}
        </SliderPrimitive.Root>
      </div>
    </section>
  );
});
DualRangeSlider.displayName = 'DualRangeSlider';

export default DualRangeSlider;
