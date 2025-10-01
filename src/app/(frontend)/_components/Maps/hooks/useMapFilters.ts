'use client';
import { useAtom } from 'jotai';
import { businessTypeFilterAtom, categoryTypeFilterAtom } from '../states/mapAtoms';

export const useMapFilters = () => {
  const [businessType, setBusinessType] = useAtom(businessTypeFilterAtom);
  const [categoryType, setCategoryType] = useAtom(categoryTypeFilterAtom);

  const updateFilters = (filters: { businessType?: string; categoryType?: string }) => {
    if (filters.businessType !== undefined) {
      setBusinessType(filters.businessType || null);
    }
    if (filters.categoryType !== undefined) {
      setCategoryType(filters.categoryType || null);
    }
  };

  const clearFilters = () => {
    setBusinessType(null);
    setCategoryType(null);
  };

  return {
    filters: {
      businessType,
      categoryType,
    },
    updateFilters,
    clearFilters,
  };
};
