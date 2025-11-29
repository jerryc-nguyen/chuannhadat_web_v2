'use client';
import { useAtom } from 'jotai';
import { businessTypeFilterAtom, categoryTypeFilterAtom } from '../states/mapAtoms';

export const useMapFilters = () => {
  const [businessType, setBusinessType] = useAtom(businessTypeFilterAtom);
  const [categoryType, setCategoryType] = useAtom(categoryTypeFilterAtom);

  const updateFilters = (filters: { businessType?: string; categoryType?: string }) => {
    // Handle businessType: if provided (even as undefined), update it
    if ('businessType' in filters) {
      setBusinessType(filters.businessType || null);
    }
    // Handle categoryType: if provided (even as undefined), update it
    if ('categoryType' in filters) {
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
