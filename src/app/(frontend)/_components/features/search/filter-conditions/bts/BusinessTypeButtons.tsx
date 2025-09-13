import { FilterFieldName } from '@common/types';
import useFilterState from '../hooks/useFilterState';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';

export default function BusinessTypeButtons() {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const businessType = getLocalFieldValue(FilterFieldName.BusinessType);
  return (
    <Tabs defaultValue={businessType?.value as string}>
      <TabsList className="flex w-full h-11">
        {filterFieldOptions.businessTypeOptions?.map((option) => {
          return (
            <TabsTrigger
              value={option.value + ''}
              key={option.text}
              className="flex-1 rounded-md py-2"
              onClick={() => {
                setLocalFieldValue(FilterFieldName.BusinessType, option);
              }}
            >
              {option.text}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
