import { getQueryClient } from '@common/api/react-query';
import { get, set } from 'lodash-es';

type TValueUpdate = {
  setterKey: string;
  newValue: any;
};

export const useManagePostsCache = () => {
  const updateRowData = (updateRes: A) => {
    getQueryClient().setQueriesData(
      {
        queryKey: ['collection-post'],
      },
      (prev: A) => {
        const recordId = get(updateRes, 'id', '');
        return {
          ...prev,
          data: prev.data.map((record: A) => {
            if (record.id === recordId) {
              return {
                ...record,
                ...updateRes,
              };
            }
            return record;
          }),
        };
      },
    );
  };

  const updateFieldDataOnRow = (recordId: number, values: TValueUpdate[]) => {
    getQueryClient().setQueriesData(
      {
        queryKey: ['collection-post'],
      },
      (prev: A) => {
        return {
          ...prev,
          data: prev.data.map((record: A) => {
            if (record.id === recordId) {
              const clonedRecord = { ...record };
              values.forEach((value) => {
                set(clonedRecord, value.setterKey, value.newValue);
              });
              return clonedRecord;
            }
            return record;
          }),
        };
      },
    );
  };

  return { updateRowData, updateFieldDataOnRow };
};
