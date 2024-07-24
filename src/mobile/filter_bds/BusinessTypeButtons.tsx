import { useAtom } from 'jotai';
import { Block, Segmented, SegmentedButton } from 'konsta/react';
import { filterStateAtom, localFilterStateAtom } from './states';

export default function BusinessTypeButtons() {
  const [filterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  return (
    <Block strongIos margin='my-0 mt-2'>
      <Segmented outline>
        {filterState.businessTypeOptions?.map((option) => {
          return (
            <SegmentedButton
              key={option.text}
              active={
                option.text == localFilterState.businessType?.text
              }
              onClick={() => {
                setLocalFilterState({
                  ...localFilterState,
                  businessType: option,
                });
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
