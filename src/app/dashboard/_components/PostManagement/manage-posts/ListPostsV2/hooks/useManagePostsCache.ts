import { getQueryClient } from '@common/api/react-query';
import { get, set } from 'lodash-es';

type TValueUpdate = {
  setterKey: string;
  newValue: any;
};

export const useManagePostsCache = () => {
  const updateRowData = (updateRes: A) => {
    const qc = getQueryClient();
    // Update generic datagrid cache shape only: { rows: [...] }
    qc.setQueriesData(
      {
        queryKey: ['datagrid-list'],
      },
      (prev: any) => {
        const recordId = get(updateRes, 'id', '');
        if (!prev || !Array.isArray(prev?.rows)) return prev;
        return {
          ...prev,
          rows: prev.rows.map((row: any) => (row?.id === recordId ? { ...row, ...updateRes } : row)),
        };
      },
    );
  };

  const updateFieldDataOnRow = (recordId: number, values: TValueUpdate[]) => {
    const qc = getQueryClient();
    // Update generic datagrid cache shape only: { rows: [...] }
    qc.setQueriesData(
      {
        queryKey: ['datagrid-list'],
      },
      (prev: any) => {
        if (!prev || !Array.isArray(prev?.rows)) return prev;
        return {
          ...prev,
          rows: prev.rows.map((row: any) => {
            if (row?.id === recordId) {
              const clonedRow = { ...row };
              values.forEach((value) => {
                set(clonedRow, value.setterKey, value.newValue);
              });
              return clonedRow;
            }
            return row;
          }),
        };
      },
    );
  };

  const refreshDatagridList = () => {
    const qc = getQueryClient();
    qc.invalidateQueries({ queryKey: ['datagrid-list'] });
  };

  return { updateRowData, updateFieldDataOnRow, refreshDatagridList };
};
