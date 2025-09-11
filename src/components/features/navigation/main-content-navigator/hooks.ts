import { OptionForSelect } from "@common/models"
import { useAtom } from "jotai";
import { MCNCityAtom, MCNContentTypeAtom, MCNDistrictAtom, MCNWardAtom } from "./states";
import { useCallback, useMemo, useState } from "react";
import { NEWS_TYPE_OPTION, POSTS_TYPE_OPTION } from "./constants";
import useFilterState from "@frontend/CategoryPage/mobile/filter_bds/hooks/useFilterState";
import { useQueryClient } from "@tanstack/react-query";
import { navigatorApi } from "./apis";
import useSearchScope, { SearchScopeEnums } from "@common/hooks/useSearchScope";
import useModals from "@components/features/layout/mobile-modals/hooks";

type TSubmitProps = {
  contentType?: OptionForSelect;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
}

export default function useMainContentNavigator() {
  const [globalContentType, setGlobalContentType] = useAtom(MCNContentTypeAtom);
  const [globalCity, setGlobalCity] = useAtom(MCNCityAtom);
  const [globalDistrict, setGlobalDistrict] = useAtom(MCNDistrictAtom);
  const [globalWard, setGlobalWard] = useAtom(MCNWardAtom);
  const queryClient = useQueryClient();
  const { applyAllFilters } = useFilterState();
  const { searchScope } = useSearchScope();
  const { closeModals } = useModals();

  // Local state for the component
  const [city, setCity] = useState<OptionForSelect | undefined>(globalCity);
  const [district, setDistrict] = useState<OptionForSelect | undefined>(globalDistrict);
  const [ward, setWard] = useState<OptionForSelect | undefined>(globalWard);
  const [contentType, setContentType] = useState<OptionForSelect | undefined>(globalContentType);

  // Content options
  const contentOptions = useMemo(() => [
    POSTS_TYPE_OPTION,
    NEWS_TYPE_OPTION,
    // PRICE_HISTORY_TYPE_OPTION
  ], []);

  const selectedLocationFullText = useMemo((): string | undefined => {
    const results = [];
    if (globalWard) {
      results.push(globalWard.text);
    }
    if (globalDistrict) {
      results.push(globalDistrict.text);
    }
    if (globalCity) {
      results.push(globalCity.text);
    }
    return results.join(', ');
  }, [globalCity, globalDistrict, globalWard]);

  const updateValues = useCallback(({ contentType, city, district, ward }: TSubmitProps) => {
    setGlobalContentType(contentType);
    setGlobalCity(city);
    setGlobalDistrict(district);
    setGlobalWard(ward);
  }, [setGlobalCity, setGlobalContentType, setGlobalDistrict, setGlobalWard]);

  /**
   * Reset all location states (city, district, ward) to undefined
   * This clears both global and local state
   */
  const resetLocations = useCallback(() => {
    // Reset global state
    setGlobalCity(undefined);
    setGlobalDistrict(undefined);
    setGlobalWard(undefined);

    // Reset local state
    setCity(undefined);
    setDistrict(undefined);
    setWard(undefined);
  }, [setGlobalCity, setGlobalDistrict, setGlobalWard]);

  const extraParams = useMemo(() => {
    const results: Record<string, A> = {};
    if (globalDistrict) {
      results.district_id = globalDistrict.value;
    } else if (globalCity) {
      results.city_id = globalCity.value;
    }
    return results;
  }, [globalCity, globalDistrict]);

  // Reset functions
  const resetDistrict = useCallback(() => {
    setDistrict(undefined);
  }, []);

  const resetWard = useCallback(() => {
    setWard(undefined);
  }, []);

  // Selection handlers
  const onSelectCity = useCallback((cityOption?: OptionForSelect) => {
    resetDistrict();
    resetWard();
    const finalOption = cityOption?.value !== 'all' ? cityOption : undefined;
    setCity(finalOption);
    return finalOption;
  }, [resetDistrict, resetWard]);

  const onSelectDistrict = useCallback((districtOption?: OptionForSelect) => {
    resetWard();
    const finalOption = districtOption?.value !== 'all' ? districtOption : undefined;
    setDistrict(finalOption);
    return finalOption;
  }, [resetWard]);

  const onSelectWard = useCallback((wardOption?: OptionForSelect) => {
    const finalOption = wardOption?.value !== 'all' ? wardOption : undefined;
    setWard(finalOption);
    return finalOption;
  }, []);

  // Content type change handler
  const onContentTypeChanged = useCallback((option: A) => {
    setContentType(option);
  }, []);

  // Navigation params
  const navigatorParams = useCallback((): Record<string, A> => {
    const options: Record<string, A> = {};
    options.content_type = contentType?.value || POSTS_TYPE_OPTION.value;

    if (city) {
      options.city_id = city.value;
    }
    if (district) {
      options.district_id = district.value;
    }
    if (ward) {
      options.ward_id = ward.value;
    }
    return options;
  }, [city, contentType, district, ward]);

  const onSubmitByApplyFilter = useCallback(async () => {
    updateValues({ contentType, city, district, ward });
    try {
      applyAllFilters({
        city,
        district,
        ward
      });
      queryClient.invalidateQueries({ queryKey: ['useQueryPosts'] });
      closeModals();
    } catch (error) {
      // Handle error silently
    }
  }, [applyAllFilters, city, closeModals, contentType, district, queryClient, updateValues, ward]);


  const onSubmitByRedirect = useCallback(async () => {
    updateValues({ city, district, ward })

    try {
      const path = await navigatorApi(navigatorParams())
      window.location.href = path
    } catch (error) {
      // Handle error silently
    }
  }, [city, district, navigatorParams, updateValues, ward]);

  // Submit function
  const onSubmit = useCallback(() => {
    if (searchScope === SearchScopeEnums.Category) {
      onSubmitByApplyFilter();
    } else {
      onSubmitByRedirect();
    }
  }, [onSubmitByApplyFilter, onSubmitByRedirect, searchScope]);

  return {
    // Global state
    contentType: globalContentType,
    city: globalCity,
    district: globalDistrict,
    ward: globalWard,

    // Local state
    localCity: city,
    localDistrict: district,
    localWard: ward,
    localContentType: contentType,

    // Functions
    updateValues,
    resetLocations,
    selectedLocationFullText,
    extraParams,
    resetDistrict,
    resetWard,
    onSelectCity,
    onSelectDistrict,
    onSelectWard,
    onContentTypeChanged,
    navigatorParams,
    onSubmit,

    // Constants
    contentOptions
  };
}
