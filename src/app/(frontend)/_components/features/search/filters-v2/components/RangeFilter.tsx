import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import DualRangeSlider from '@components/dual-range-slider';
import { OptionForSelect } from '@common/types';
import { RangeFilterProps } from '../types/pure-ui-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash-es';
import { Input } from '@components/ui/input';
import { formatNumber, formatNumberString } from '@common/numberHelpers';

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
  disabled = false
}: RangeFilterProps) {

  const [currentValue, setCurrentValue] = useState(value);
  // Unified formatter for range text
  const formatRangeLabel = useCallback(
    (minVal: number, maxVal: number) => {
      if (formatRangeText) return formatRangeText(minVal, maxVal);
      if (formatValue) return `${formatValue(minVal)} - ${formatValue(maxVal)}`;
      return `${minVal} - ${maxVal}`;
    },
    [formatRangeText, formatValue]
  );
  // Unified formatter for input display numbers (safe against undefined/NaN)
  const formatNumberDisplay = useCallback(
    (n?: number) => {
      if (n === undefined || Number.isNaN(n)) return '';
      return formatInputNumber ? formatNumber(n) : String(n);
    },
    [formatInputNumber]
  );

  const sliderRange = useMemo(() => {
    return [value?.range?.min ?? min, value?.range?.max ?? max];
  }, [value?.range?.min, value?.range?.max, min, max]);

  const [sliderValues, setSliderValues] = useState(sliderRange);
  const [minInput, setMinInput] = useState<string>(formatNumberDisplay(sliderRange[0]));
  const [maxInput, setMaxInput] = useState<string>(formatNumberDisplay(sliderRange[1]));

  // Prevent feedback loop: mark when changes originate from input blur
  const lastChangeByInputRef = useRef(false);

  // Keep local slider/input values in sync when external value changes (e.g., option selection)
  useEffect(() => {
    const nextRange = [value?.range?.min || min, value?.range?.max || max];

    // Avoid unnecessary state updates
    if (nextRange[0] !== sliderValues[0] || nextRange[1] !== sliderValues[1]) {
      // If the external change is a reflection of an input-originated emission,
      // skip moving the slider to keep it static for input changes.
      if (lastChangeByInputRef.current) {
        lastChangeByInputRef.current = false;
      } else {
        setSliderValues(nextRange);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.range?.min, value?.range?.max, min, max]);

  const debounceChangeValues = useCallback(
    debounce((values: number[]) => {
      const rangeText = formatRangeLabel(values[0], values[1]);

      const rangeValue: OptionForSelect = {
        range: { min: values[0], max: values[1] },
        text: rangeText,
      };
      onRangeChange(rangeValue);
    }, 200),
    [onRangeChange, formatRangeLabel],
  );

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
    debounceChangeValues(values);
    setCurrentValue(undefined);
    setInputValueByRange(values);
  };

  const parseInputValue = (raw: string): number | undefined => {
    const normalized = raw.replace(/[^\d]/g, '');
    if (normalized === '') return undefined;
    const n = Number(normalized);
    return Number.isNaN(n) ? undefined : n;
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawStr = e.target.value;
    // Allow free typing without clamping during input
    setMinInput(rawStr);
    const parsedMin = parseInputValue(rawStr);
    const parsedMax = parseInputValue(maxInput);
    const nextMin = parsedMin ?? sliderValues[0];
    const nextMax = parsedMax ?? sliderValues[1];
    lastChangeByInputRef.current = true;
    debounceChangeValues([nextMin, nextMax]);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawStr = e.target.value;
    // Allow free typing without clamping during input
    setMaxInput(rawStr);
    const parsedMin = parseInputValue(minInput);
    const parsedMax = parseInputValue(rawStr);
    const nextMin = parsedMin ?? sliderValues[0];
    const nextMax = parsedMax ?? sliderValues[1];
    lastChangeByInputRef.current = true;
    debounceChangeValues([nextMin, nextMax]);
  };

  const handleOptionSelect = (option: OptionForSelect) => {
    onRangeChange(option);
    setCurrentValue(option);
    setInputValueByOption(option);
  };

  const setInputValueByOption = (option: OptionForSelect) => {
    setMinInput(formatNumberDisplay(option?.range?.min as number));
    setMaxInput(formatNumberDisplay(option?.range?.max as number));
  };

  const setInputValueByRange = (values: number[]) => {
    setMinInput(formatNumberDisplay(values[0]));
    setMaxInput(formatNumberDisplay(values[1]));
  };

  const handleMinInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawStr = e.currentTarget.value;
    if (rawStr === '') return;
    setMinInput(formatNumberString(rawStr));
  };

  const handleMaxInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawStr = e.currentTarget.value;
    if (rawStr === '') return;
    setMaxInput(formatNumberString(rawStr));
  };

  return (
    <div className={`${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className={`grid grid-cols-2 gap-3 cpx-4 is-range-inputs`}>
        <div className="flex flex-col gap-1">
          <label htmlFor="range-min" className="text-xs text-secondary">{minLabel}</label>
          <Input
            id="range-min"
            type={formatInputNumber ? 'text' : 'number'}
            value={minInput}
            onChange={handleMinInputChange}
            onBlur={handleMinInputBlur}
            min={0}
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
            onBlur={handleMaxInputBlur}
            min={0}
            max={max}
            step={step}
            disabled={disabled}
            aria-label="Maximum"
          />
        </div>
      </div>

      <div className={'mb-4 mt-5 cpx-4 is-ranges'}>
        <DualRangeSlider
          min={min}
          max={max}
          value={sliderValues}
          onValueChange={handleSliderChange}
          disabled={disabled}
          step={step}
          trackColor={'hsla(0, 4%, 85%, 1.00)'}
        />
      </div>

      {/* Predefined options */}
      <ListCheckOptions
        options={options}
        selectedOption={currentValue}
        onSelect={handleOptionSelect}
      />

      {/* Loading indicator */}
      {
        isLoading && (
          <div className="flex justify-center p-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          </div>
        )
      }
    </div >
  );
}
