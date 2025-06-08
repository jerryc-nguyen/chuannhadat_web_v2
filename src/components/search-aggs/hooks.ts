import { useMemo } from "react";
import { useAtom } from "jotai";
import { isUseAggOptionsAtom, searchAggsAtom } from "./states";
import { OptionForSelect } from "@models";

export default function useSearchAggs() {
  const [searchAggs, setSearchAggs] = useAtom(searchAggsAtom);
  const [isUseAggOptions, setIsUseAggOptions] = useAtom(isUseAggOptionsAtom)

  const updateSearchAggs = (agg: Record<string, A>) => {
    setSearchAggs(agg);
  }

  const busCatTypeOptions = useMemo(() => {
    return (searchAggs.bus_cat_types || []).map((option: A) => {
      return option;
    })
  }, [searchAggs])

  const priceOptions = useMemo(() => {
    return (searchAggs.prices || []).map((option: A) => {
      return option;
    })
  }, [searchAggs])

  const areasOptions = useMemo(() => {
    return (searchAggs.areas || []).map((option: A) => {
      return option;
    })
  }, [searchAggs])

  const directionsOptions = useMemo(() => {
    return (searchAggs.directions || []).map((option: A) => {
      return option;
    })
  }, [searchAggs])

  const projectsOptions = useMemo(() => {
    return (searchAggs.projects || []).map((option: A) => {
      return option;
    })
  }, [searchAggs])

  const locationAgg = (agg: Record<string, A>) => {
    const city_counts: Record<string, A> = {};
    const district_counts: Record<string, A> = {};
    const ward_counts: Record<string, A> = {};

    for (const [city_id, districts] of Object.entries(agg.districts || {})) {
      if (Array.isArray(districts)) {
        let total = 0;
        districts.forEach((item) => {
          district_counts[item.district_id] = item.count
          total += item.count
        })
        city_counts[city_id] = total
      }
    }

    for (const [district_id, wards] of Object.entries(agg.wards || {})) {
      if (Array.isArray(wards)) {
        wards.forEach((item) => {
          ward_counts[item.ward_id] = item.count
        })
      }
    }

    return {
      city_counts: city_counts,
      district_count: district_counts,
      ward_counts: ward_counts,
      city_ids: Object.keys(agg.districts || {}),
      district_ids: Object.keys(district_counts || {}),
      ward_ids: Object.keys(ward_counts || {}),
    }
  }

  const buildLocationsList = (agg: Record<string, A>) => {
    let districtOptions: OptionForSelect[] = [];
    let wardOptions: OptionForSelect[] = [];

    for (const [, districts] of Object.entries(agg.districts || {})) {
      districtOptions = districtOptions.concat(districts as OptionForSelect[])
    }

    for (const [, wards] of Object.entries(agg.wards || {})) {
      wardOptions = wardOptions.concat(wards as OptionForSelect[])
    }

    return {
      districtOptions: districtOptions,
      wardOptions: wardOptions
    }
  }

  const profileLocationAgg = useMemo(() => {
    return locationAgg(searchAggs);
  }, [searchAggs])

  const locationsList = useMemo(() => {
    return buildLocationsList(searchAggs);
  }, [searchAggs])

  return {
    profileLocationAgg,
    searchAggs,
    setSearchAggs,
    updateSearchAggs,
    busCatTypeOptions,
    priceOptions,
    areasOptions,
    directionsOptions,
    projectsOptions,
    isUseAggOptions,
    setIsUseAggOptions,
    locationsList
  }
}
