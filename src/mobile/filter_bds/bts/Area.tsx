import { FilterFieldName, OptionForSelect } from '@models';
import ListCheckOptions from '@mobile/ui/ListCheckOptions';
import useFilterState from '../hooks/useFilterState';
import useSearchAggs from '@components/search-aggs/hooks';
import DualRangeSlider from '@components/dual-range-slider';
import { formatAreaText } from '@common/utils';

export default function Area({ onSelect }: { onSelect?: (option: OptionForSelect) => void }) {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Area);
  const { areasOptions, isUseAggOptions } = useSearchAggs();
  const options = isUseAggOptions ? areasOptions : filterFieldOptions.areaOptions;

  const isSliderDisabled = value?.text !== formatAreaText(value?.range?.min, value?.range?.max);
  const areaSliderRange = isSliderDisabled
    ? [0, 150]
    : [value?.range?.min as number, value?.range?.max as number];
  const handleChangeAreaSlider = (values: number[]) => {
    setLocalFieldValue(FilterFieldName.Area, {
      range: { min: values[0], max: values[1] },
      text: formatAreaText(values[0], values[1]),
    });
  };

  return (
    <section className="w-[400px]">
      <div className="pb-2 pr-2">
        <DualRangeSlider
          disabled={isSliderDisabled}
          value={areaSliderRange}
          showLabel
          labelPosition="top"
          onValueChange={handleChangeAreaSlider}
          max={150}
          min={0}
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
