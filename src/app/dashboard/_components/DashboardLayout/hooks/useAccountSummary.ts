"use client"
import { API_ROUTES } from '@common/router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DashboardSummaryApi } from '../apis';

export const useAccountSummary = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', API_ROUTES.DASHBOARD.ACCOUNT_SUMMARY],
    queryFn: () => DashboardSummaryApi.accountSummary(),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
    select: (data) => data.data,
  });

  return { data, isLoading };
};
