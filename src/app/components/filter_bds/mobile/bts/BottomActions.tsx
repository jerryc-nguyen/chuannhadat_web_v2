import { Button, Toolbar } from 'konsta/react';
import { FilterFieldName, FilterOption } from '../../types';
import { useAtom } from 'jotai';
import { applyFieldBtsFilterAtom, clearFieldBtsFilterAtom } from '../../states';

export default function BottomActions({
  fieldName,
  selectedOption
}: {
  fieldName: FilterFieldName;
  selectedOption: FilterOption;
}) {
  const [, applySelectedField] = useAtom(applyFieldBtsFilterAtom);
  const [, clearSelectedField] = useAtom(clearFieldBtsFilterAtom);

  return (
    <Toolbar top={false}>
      <Button
        onClick={() => {
          clearSelectedField({
            fieldName: fieldName
          });
        }}
      >
        Bỏ chọn
      </Button>
      <Button
        onClick={() => {
          applySelectedField({
            fieldName: fieldName,
            option: selectedOption
          });
        }}
      >
        Áp dụng
      </Button>
    </Toolbar>
  );
}
