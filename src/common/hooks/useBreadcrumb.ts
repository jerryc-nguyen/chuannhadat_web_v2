import { useSetAtom } from 'jotai';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  IBreadcrumbItem,
} from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import React from 'react';

export const useBreadcrumb = (breadcrumb: IBreadcrumbItem[]) => {
  const setBreadCrumb = useSetAtom(breadcrumbAtom);

  React.useEffect(() => {
    setBreadCrumb((state) => [...state, ...breadcrumb]);
    return () => {
      setBreadCrumb(defaultBreadcrumb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
