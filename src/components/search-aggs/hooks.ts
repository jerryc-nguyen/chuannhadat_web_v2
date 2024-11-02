import { useMemo } from "react";
import { useAtom } from "jotai";
import { searchAggsAtom } from "./states";

export default function useSearchAggs() {
  const [searchAggs, setSearchAggs] = useAtom(searchAggsAtom);
  const [profileSearchAggs, setProfileSearchAggs] = useAtom(searchAggsAtom);

  const locationAgg = (agg: Record<string, A>) => {
    let district_ids: number[] = [];
    let ward_ids: number[] = [];
    let city_counts: Record<string, A> = {};
    let district_counts: Record<string, A> = {};
    let ward_counts: Record<string, A> = {};

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


  const profileLocationAgg = useMemo(() => {
    return locationAgg(profileSearchAggs);
  }, [profileSearchAggs])


  return {
    profileLocationAgg,
    searchAggs,
    setSearchAggs,
    profileSearchAggs,
    setProfileSearchAggs
  }
}
