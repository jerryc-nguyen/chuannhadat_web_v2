import { useAtom } from 'jotai';
import { filterStateAtom, localFilterStateAtom } from '../states';
import { FilterOption } from '../types';
import { OptionForSelect } from '@app/types';
import { FilterFieldName } from '@app/types';

export default function useFilterState() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const getFieldValue = (fieldId: FilterFieldName) => {
    const fieldName = FilterFieldName[fieldId];
    // @ts-ignore
    return localFilterState[fieldName] ?? filterState[fieldName];
  };

  const setLocalFieldValue = (
    fieldId: FilterFieldName,
    option: FilterOption | OptionForSelect | undefined
  ) => {
    const fieldName = FilterFieldName[fieldId];
    // @ts-ignore
    setLocalFilterState({
      ...localFilterState,
      [fieldName]: option,
    });
  };

  const applyAllFilters = (filters?: {}) => {
    setFilterState({
      ...filterState,
      ...filters,
    });
  };

  return {
    filterState: filterState,
    localFilterState: localFilterState,
    getFieldValue: getFieldValue,
    setLocalFieldValue: setLocalFieldValue,
    applyAllFilters: applyAllFilters,
  };
}
