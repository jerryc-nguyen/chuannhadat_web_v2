import { OptionForSelect } from "@models"
import { useAtom } from "jotai";
import { MCNCityAtom, MCNContentTypeAtom, MCNDistrictAtom, MCNWardAtom } from "./states";
import { useMemo } from "react";

type TSubmitProps = {
  contentType?: OptionForSelect;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
}

export default function useMainContentNavigator() {
  const [contentType, setContentType] = useAtom(MCNContentTypeAtom);
  const [city, setCity] = useAtom(MCNCityAtom);
  const [district, setDistrict] = useAtom(MCNDistrictAtom);
  const [ward, setWard] = useAtom(MCNWardAtom);

  const selectedLocationFullText = useMemo((): string | undefined => {
    const results = [];
    if (ward) {
      results.push(ward.text);
    }
    if (district) {
      results.push(district.text);
    }
    if (city) {
      results.push(city.text);
    }
    return results.join(', ');
  }, [city, district, ward]);

  const submit = ({ contentType, city, district, ward }: TSubmitProps) => {
    setContentType(contentType);
    setCity(city);
    setDistrict(district);
    setWard(ward);
  }

  const autocompleteProjectParams = useMemo(() => {
    const results: Record<string, A> = {};
    if (district) {
      results.district_id = district.value;
    } else if (city) {
      results.city_id = city.value;
    }
    return results;
  }, [city, district])

  return {
    contentType,
    city,
    district,
    ward,
    submit,
    selectedLocationFullText,
    autocompleteProjectParams
  }
}
