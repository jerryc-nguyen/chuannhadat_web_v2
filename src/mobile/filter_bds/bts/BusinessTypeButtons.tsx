import { useAtom } from 'jotai';
import { Block, Segmented, SegmentedButton } from 'konsta/react';
import { filterStateAtom } from '../states';
import { FilterFieldName } from '@app/types';
import useFilterState from '../hooks/useFilterState';

export default function BusinessTypeButtons() {
  const [filterState] = useAtom(filterStateAtom);
  const { getFieldValue, setLocalFieldValue } = useFilterState();
  const value = getFieldValue(FilterFieldName.businessType);

  return (
    <Block strongIos margin='my-0 mt-2'>
      <Segmented strong>
        {filterState.businessTypeOptions?.map((option) => {
          return (
            <SegmentedButton
              strong
              key={option.text}
              active={option.text == value?.text}
              onClick={() => {
                setLocalFieldValue(
                  FilterFieldName.businessType,
                  option
                );
              }}
            >
              {option.text}
            </SegmentedButton>
          );
        })}
      </Segmented>
    </Block>
  );
}
