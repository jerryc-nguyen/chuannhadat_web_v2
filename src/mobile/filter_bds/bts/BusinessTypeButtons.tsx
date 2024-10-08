import { FilterFieldName } from '@models';
import useFilterState from '../hooks/useFilterState';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';

export default function BusinessTypeButtons() {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const businessType = getLocalFieldValue(FilterFieldName.BusinessType);
  return (
    <Tabs defaultValue={businessType?.value as string}>
      <TabsList className="flex w-full">
        {filterFieldOptions.businessTypeOptions?.map((option) => {
          return (
            <TabsTrigger
              value={option.value.toString()}
              key={option.text}
              className="flex-1"
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
