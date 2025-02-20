import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@models';
import useSearchAggs from '@components/search-aggs/hooks';
import DualRangeSilder from '@components/dual-range-slider';
import React from 'react';
import { formatPriceFilterChip, formatRangeText } from '@common/utils';

export default function Price({ onSelect }: { onSelect?: (option: OptionForSelect) => void }) {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Price);
  const { priceOptions, isUseAggOptions } = useSearchAggs();
  const options = isUseAggOptions ? priceOptions : filterFieldOptions.priceOptions;

  const isSliderDisabled =
    value?.text !== formatRangeText(value?.range?.min as number, value?.range?.max as number);
  const valueSliderRange = isSliderDisabled
    ? [100_000_000, 20_000_000_000]
    : [value?.range?.min as number, value?.range?.max as number];

  const handleChangePriceSlider = (values: number[]) => {
    setLocalFieldValue(FilterFieldName.Price, {
      range: { min: values[0], max: values[1] },
      text: formatRangeText(values[0], values[1]),
    });
  };
  return (
    <section className="w-[400px]">
      <div className="pb-2 pr-2">
        <DualRangeSilder
          disabled={isSliderDisabled}
          value={valueSliderRange}
          showLabel
          labelPosition="top"
          onValueChange={handleChangePriceSlider}
          min={100_000_000}
          max={20_000_000_000}
          step={100_000_000}
          formatLabel={formatPriceFilterChip}
        />
      </div>
      <ListCheckOptions
        options={options}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.Price, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      />
    </section>
  );
}
