import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import DualRangeSlider from '@components/dual-range-slider';
import { OptionForSelect } from '@common/types';
import { RangeFilterProps } from '../types/pure-ui-types';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash-es';

/**
 * Reusable RangeFilter component that combines ListCheckOptions with DualRangeSlider
 * This component can replace the repetitive patterns found in Price and Area components
 */
export default function RangeFilter({
  value,
  options,
  onRangeChange,
  min = 0,
  max = 100,
  step,
  formatValue,
  formatRangeText,
  isLoading = false,
  disabled = false,
}: RangeFilterProps) {
  // Determine if slider should be disabled (when a predefined option is selected)
  const expectedRangeText = formatRangeText
    ? formatRangeText(value?.range?.min as number, value?.range?.max as number)
    : formatValue
      ? `${formatValue(value?.range?.min as number)} - ${formatValue(value?.range?.max as number)}`
      : `${value?.range?.min} - ${value?.range?.max}`;

  const isSliderDisabled = value?.text !== expectedRangeText;

  // Get slider range values
  const sliderRange = isSliderDisabled
    ? [min, max]
    : [value?.range?.min as number, value?.range?.max as number];

  const [sliderValues, setSliderValues] = useState(sliderRange);

  // Debounced handler for slider changes
  const debounceChangeValues = useCallback(
    debounce((values: number[]) => {
      const rangeText = formatRangeText
        ? formatRangeText(values[0], values[1])
        : formatValue
          ? `${formatValue(values[0])} - ${formatValue(values[1])}`
          : `${values[0]} - ${values[1]}`;

      const rangeValue: OptionForSelect = {
        range: { min: values[0], max: values[1] },
        text: rangeText,
      };
      onRangeChange(rangeValue);
    }, 500),
    [onRangeChange, formatValue, formatRangeText],
  );

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
    debounceChangeValues(values);
  };

  const handleOptionSelect = (option: OptionForSelect) => {
    onRangeChange(option);
  };

  return (
    <div className={`${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Custom range slider */}
      <div className="mb-4 px-4 mt-4">
        <DualRangeSlider
          min={min}
          max={max}
          value={sliderValues}
          onValueChange={handleSliderChange}
          disabled={isSliderDisabled}
          step={step}
        />
      </div>

      {/* Predefined options */}
      <ListCheckOptions
        options={options}
        selectedOption={value}
        onSelect={handleOptionSelect}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}
