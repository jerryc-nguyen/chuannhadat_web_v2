import { FilterFieldName } from '@models';
import useFilterState from '../hooks/useFilterState';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';

export default function BusinessTypeButtons() {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.businessType);

  return (
    <Tabs defaultValue={value}>
      <TabsList className="grid w-full grid-cols-2">
        {filterFieldOptions.businessTypeOptions?.map((option) => {
          return (
            <TabsTrigger
              value={option.value.toString()}
              key={option.text}
              onClick={() => {
                setLocalFieldValue(FilterFieldName.businessType, option);
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
