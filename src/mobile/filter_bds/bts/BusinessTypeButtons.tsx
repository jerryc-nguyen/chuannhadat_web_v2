import {
  Block,
  Segmented,
  SegmentedButton,
} from 'konsta/react';
import { FilterFieldName } from '@models';
import useFilterState from '../hooks/useFilterState';

export default function BusinessTypeButtons() {
  const {
    getLocalFieldValue,
    setLocalFieldValue,
    filterFieldOptions,
  } = useFilterState();
  const value = getLocalFieldValue(
    FilterFieldName.businessType,
  );

  return (
    <Block strongIos margin="my-0 mt-2">
      <Segmented strong>
        {filterFieldOptions.businessTypeOptions?.map(
          (option) => {
            return (
              <SegmentedButton
                strong
                key={option.text}
                active={option.text == value?.text}
                onClick={() => {
                  setLocalFieldValue(
                    FilterFieldName.businessType,
                    option,
                  );
                }}
              >
                {option.text}
              </SegmentedButton>
            );
          },
        )}
      </Segmented>
    </Block>
  );
}
