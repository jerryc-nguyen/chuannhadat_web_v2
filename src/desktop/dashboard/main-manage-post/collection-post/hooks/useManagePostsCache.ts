import { getQueryClient } from "@api/react-query";
import { get } from 'lodash-es';

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

  return { updateRowData }
}
