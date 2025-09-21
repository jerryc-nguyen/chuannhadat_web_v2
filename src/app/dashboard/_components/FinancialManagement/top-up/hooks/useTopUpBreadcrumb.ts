import { DASHBOARD_ROUTES } from '@common/router';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  type IBreadcrumbItem,
} from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const useTopUpBreadcrumb = () => {
  const setBreadCrumb = useSetAtom(breadcrumbAtom);

  useEffect(() => {
    const currentBreadCrumn: IBreadcrumbItem[] = [
      {
        link: DASHBOARD_ROUTES.balance.topup,
        title: 'Nạp tiền vào tài khoản',
        isActive: true,
      },
    ];
    setBreadCrumb((state) => [...state, ...currentBreadCrumn]);
    return () => {
      setBreadCrumb(defaultBreadcrumb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
