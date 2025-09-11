import { FilterFieldName, OptionForSelect } from '@common/models';
import ListCheckOptions from '@components/mobile-ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import useSearchAggs from '@components/features/search/search-aggs/hooks';
import DualRangeSlider from '@components/dual-range-slider';
import { formatAreaText } from '@common/utils';
import { debounce } from 'lodash-es';
import { useCallback, useState } from 'react';

const MIN_AREA = 0;
const MAX_AREA = 150;

export default function Area({ onSelect }: { onSelect?: (option: OptionForSelect) => void }) {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Area);
  const { areasOptions, isUseAggOptions } = useSearchAggs();
  const options = isUseAggOptions ? areasOptions : filterFieldOptions.areaOptions;

  const isSliderDisabled = value?.text !== formatAreaText(value?.range?.min, value?.range?.max);
  const areaSliderRange = isSliderDisabled
    ? [MIN_AREA, MAX_AREA]
    : [value?.range?.min as number, value?.range?.max as number];

  const [sliderValues, setSliderValues] = useState(areaSliderRange);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChangeAreaValues = useCallback(
    debounce((values: A) => {
      setLocalFieldValue(FilterFieldName.Area, {
        range: { min: values[0], max: values[1] },
        text: formatAreaText(values[0], values[1]),
      });
    }, 500),
    [],
  );

  const handleChangeAreaSlider = useCallback(
    (values: A) => {
      setSliderValues(values);
      debounceChangeAreaValues(values);
    },
    [debounceChangeAreaValues],
  );

  return (
    <section className="w-[400px]">
      <div className="mx-4 pb-6 pr-2 pt-4">
        <DualRangeSlider
          disabled={isSliderDisabled}
          value={sliderValues}
          showLabel
          labelPosition="top"
          onValueChange={handleChangeAreaSlider}
          max={MAX_AREA}
          min={MIN_AREA}
          step={10}
          formatLabel={(area: number) => `${area} m²`}
        />
      </div>
      <ListCheckOptions
        options={options}
        selectedOption={value}
        onSelect={(option: OptionForSelect) => {
          setLocalFieldValue(FilterFieldName.Area, option);
          if (onSelect) {
            onSelect(option);
          }
        }}
      />
    </section>
  );
}
