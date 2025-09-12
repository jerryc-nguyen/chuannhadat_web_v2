import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@common/types';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';
import DualRangeSilder from '@components/dual-range-slider';
import React from 'react';
import { formatPriceFilterChip, formatRangeText } from '@common/utils';
import { debounce } from 'lodash-es';
import { useCallback, useState } from 'react';

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

  const [sliderValues, setSliderValues] = useState(valueSliderRange);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChangePriceValues = useCallback(
    debounce((values: number[]) => {
      setLocalFieldValue(FilterFieldName.Price, {
        range: { min: values[0], max: values[1] },
        text: formatRangeText(values[0], values[1]),
      });
    }, 500),
    [setLocalFieldValue],
  );

  const handleChangePriceSlider = (values: number[]) => {
    setSliderValues(values);
    debounceChangePriceValues(values);
  };

  return (
    <section className="w-[400px]">
      <div className="mx-6 px-2 pb-6 pt-4">
        <DualRangeSilder
          disabled={isSliderDisabled}
          value={sliderValues}
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
