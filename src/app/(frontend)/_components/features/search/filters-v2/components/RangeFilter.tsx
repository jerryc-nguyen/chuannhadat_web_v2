import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import DualRangeSlider from '@components/dual-range-slider';
import { OptionForSelect } from '@common/types';
import { RangeFilterProps } from '../types/pure-ui-types';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash-es';
import { Input } from '@components/ui/input';
import { formatNumber as formatNumberVi } from '@common/numberHelpers';

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
  minLabel = 'Nhỏ nhất',
  maxLabel = 'Lớn nhất',
  formatInputNumber = false,
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
  const [minInput, setMinInput] = useState<string>(
    formatInputNumber ? formatNumberVi(sliderRange[0]) : String(sliderRange[0])
  );
  const [maxInput, setMaxInput] = useState<string>(
    formatInputNumber ? formatNumberVi(sliderRange[1]) : String(sliderRange[1])
  );

  // Keep local slider/input values in sync when external value changes (e.g., option selection)
  useEffect(() => {
    const nextRange = isSliderDisabled ? [min, max] : [value?.range?.min as number, value?.range?.max as number];
    // Avoid unnecessary state updates
    if (nextRange[0] !== sliderValues[0] || nextRange[1] !== sliderValues[1]) {
      setSliderValues(nextRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.range?.min, value?.range?.max, isSliderDisabled, min, max]);

  // Keep input strings synced with slider values unless user cleared them
  useEffect(() => {
    const nextMinStr = formatInputNumber ? formatNumberVi(sliderValues[0]) : String(sliderValues[0]);
    const nextMaxStr = formatInputNumber ? formatNumberVi(sliderValues[1]) : String(sliderValues[1]);
    if (minInput !== '') setMinInput(nextMinStr);
    if (maxInput !== '') setMaxInput(nextMaxStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValues[0], sliderValues[1], formatInputNumber]);

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

  const clamp = (val: number) => Math.min(Math.max(val, min), max);

  const parseInputValue = (raw: string): number | undefined => {
    const normalized = raw.replace(/[^\d]/g, '');
    if (normalized === '') return undefined;
    const n = Number(normalized);
    return Number.isNaN(n) ? undefined : n;
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawStr = e.target.value;
    if (rawStr === '') {
      setMinInput('');
      return;
    }
    const raw = formatInputNumber ? parseInputValue(rawStr) : Number(rawStr);
    if (raw === undefined || Number.isNaN(raw)) return;
    const clamped = clamp(raw as number);
    const nextMin = Math.min(clamped, sliderValues[1]);
    const next = [nextMin, sliderValues[1]] as [number, number];
    setSliderValues(next);
    setMinInput(formatInputNumber ? formatNumberVi(nextMin) : String(nextMin));
    debounceChangeValues(next);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawStr = e.target.value;
    if (rawStr === '') {
      setMaxInput('');
      return;
    }
    const raw = formatInputNumber ? parseInputValue(rawStr) : Number(rawStr);
    if (raw === undefined || Number.isNaN(raw)) return;
    const clamped = clamp(raw as number);
    const nextMax = Math.max(clamped, sliderValues[0]);
    const next = [sliderValues[0], nextMax] as [number, number];
    setSliderValues(next);
    setMaxInput(formatInputNumber ? formatNumberVi(nextMax) : String(nextMax));
    debounceChangeValues(next);
  };

  const handleOptionSelect = (option: OptionForSelect) => {
    onRangeChange(option);
  };

  return (
    <div className={`${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Manual min/max inputs */}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="range-min" className="text-xs text-secondary">{minLabel}</label>
          <Input
            id="range-min"
            type={formatInputNumber ? 'text' : 'number'}
            value={minInput}
            onChange={handleMinInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-label="Minimum"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="range-max" className="text-xs text-secondary">{maxLabel}</label>
          <Input
            id="range-max"
            type={formatInputNumber ? 'text' : 'number'}
            value={maxInput}
            onChange={handleMaxInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-label="Maximum"
          />
        </div>
      </div>


      {/* Custom range slider */}
      <div className="mb-4 mt-4">
        <DualRangeSlider
          min={min}
          max={max}
          value={sliderValues}
          onValueChange={handleSliderChange}
          disabled={isSliderDisabled || disabled}
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
