"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@components/ui/separator";
import { MapPin, CircleAlert } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { citiesData, cityDistrictsData, districtsProjectsData, districtsStreetsData, districtsWardsData } from "@app/tao-tin-moi/constant";
import { IProductForm } from "@app/tao-tin-moi/type";
import { useCallback, useEffect, useState } from "react";
import { AutoComplete } from "@components/autocomplete";
import { Checkbox } from "@components/ui/checkbox";

import dynamic from "next/dynamic";
import { center, SimpleLatLng } from "@components/map-leaflet/config";
import MapsApiService from "@app/tao-tin-moi/apis/maps-api";
import { LoadingSpinner } from "@components/icons/loading-spinner";
const MapLeaflet = dynamic(() => import("@components/map-leaflet"), {
  ssr: false,
});

interface ILocationForm {
  form: UseFormReturn<IProductForm>;
}

const LocationForm: React.FC<ILocationForm> = ({ form }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  const city_id = form.watch("city_id");
  const district_id = form.watch("district_id");

  const [fullAddressInfo, setFullAddressInfo] = useState<{
    projectLabel?: string;
    streetLabel?: string;
    wardLabel?: string;
    districtLabel?: string;
    cityLabel?: string;
    addressText: string;
  }>({
    addressText: ""
  });

  useEffect(() => {
    setIsFirstLoad(false);
  }, [])

  useEffect(() => {
    console.log("city_id",city_id);
    if ( isFirstLoad ) return;
    if ( !city_id ) {
      setFullAddressInfo(prev => {return {...prev, cityLabel: "", districtLabel: ""}})
    } else {
      setFullAddressInfo(prev => {return {...prev, districtLabel: ""}})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city_id])

  const [isHideFullAddress, setIsHideFullAddress] = useState(false);
  const [fullAddress, setFullAddress] = useState<string>("");

  const constructFullAddress = useCallback((props: {
    projectLabel?: string;
    streetLabel?: string;
    wardLabel?: string;
    districtLabel?: string;
    cityLabel?: string;
    addressText: string;
  }) => {
    const { projectLabel, streetLabel, wardLabel, districtLabel, cityLabel, addressText } = props;
    if ( !isHideFullAddress ) {
      setFullAddress((projectLabel ? projectLabel + ", " : "") +
        (addressText ? addressText + ", " : "") +
        (streetLabel ? streetLabel + ", " : "") +
        (wardLabel ? wardLabel + ", " : "") +
        (districtLabel ? districtLabel + ", " : "") +
        (cityLabel ? cityLabel : "")
      );
    } else {
      setFullAddress(
        (districtLabel ? districtLabel + ", " : "") +
        (cityLabel ? cityLabel : "")
      );
    }
  }, [isHideFullAddress])

  useEffect(() => {
    constructFullAddress(fullAddressInfo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullAddressInfo, isHideFullAddress])

  const [latLngPosition, setLatLngPosition] = useState<SimpleLatLng>(center);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
      console.log("isLoading", isLoading);
  }, [isLoading])

  const handleSearchLocationByLatLng = async (latLng: string) => {
    setIsLoading(true);
    setIsFirstLoad(true);
    form.setValue("city_id", "");
    form.setValue("district_id", "");
    form.setValue("ward_id", "");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await MapsApiService.GetLocationByLatLng(latLng);
      setIsLoading(false);
      console.log("handleSearchLocationByLatLng", res);
      if ( res && res.data ) {
        if ( res.data.city ) form.setValue("city_id", res.data.city.value);
        if ( res.data.district ) form.setValue("district_id", res.data.district.value);
        if ( res.data.ward ) form.setValue("ward_id", res.data.ward.value);
        setTimeout(() => {
          form.trigger("city_id")
        }, 200);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch ( err: any ) {
      if ( !err.status ) {
        console.log("canceled");
      } else {
        setIsLoading(false);
      }
    } finally {
      setIsFirstLoad(false);
    }
  }

  useEffect(() => {
    if ( isFirstLoad ) return;
    handleSearchLocationByLatLng(`${latLngPosition.lat},${latLngPosition.lng}`)
  }, [latLngPosition])

  const [optionsCity] = useState<{ value: string; label: string }[]>(citiesData.map(item => {
    return {
      value: item.value.toString(),
      label: item.text
    }
  }));

  const [optionsDistrict, setOptionsDistrict] = useState<{ value: string; label: string }[]>([]);
  const [optionsWard, setOptionsWard] = useState<{ value: string; label: string }[]>([]);
  const [optionsStreet, setOptionsStreet] = useState<{ value: string; label: string }[]>([]);
  const [optionsProject, setOptionsProject] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if ( city_id ) {
      setOptionsDistrict(cityDistrictsData[city_id.toString()]?.map(item => {
        return {
          value: item.value.toString(),
          label: item.text
        }
      }));
    } else {
      setOptionsDistrict([]);
    }
  }, [city_id])

  useEffect(() => {
    if ( district_id ) {
      setOptionsWard(districtsWardsData[district_id.toString()]?.map(item => {
        return {
          value: item.value ? item.value.toString() : item.id ? item.id.toString() : "",
          label: item.text
        }
      }));
      setOptionsStreet(districtsStreetsData[district_id.toString()]?.map(item => {
        return {
          value: item.value ? item.value.toString() : item.id ? item.id.toString() : "",
          label: item.text
        }
      }));
      setOptionsProject(districtsProjectsData[district_id.toString()]?.map(item => {
        return {
          value: item.value.toString(),
          label: item.text
        }
      }));
    } else {
      setOptionsWard([]);
      setOptionsStreet([]);
      setOptionsProject([]);
    }
    setFullAddressInfo((prev) => {return {...prev, districtLabel: "", wardLabel: "", streetLabel: "", projectLabel: ""}});
  }, [district_id])

  return (
    <Card className="bg-primary/10">
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <MapPin /> Tìm kiếm địa chỉ bất động sản
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <Input
                {...field}
                className="relative"
                placeholder="Nhập địa chỉ..."
              />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Vị trí trên bản đồ</FormLabel>
              <MapLeaflet key={"mapLeaflet"} />
            </FormItem>
          )}
        /> */}

        <div className="grid gap-2">
          <Label htmlFor="subject">Vị trí trên bản đồ</Label>
          <MapLeaflet key={"mapLeaflet"}
            position={latLngPosition}
            onPositionChange={setLatLngPosition}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city_id"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel><span className="text-red-600">*</span> Tỉnh/ Thành phố</FormLabel>
                <AutoComplete
                  selectedValue={city_id}
                  onSelectedValueChange={(value) => {
                    field.onChange(value?.value || "");
                    setFullAddressInfo((prev) => {return {...prev, cityLabel: value?.label || ""}});
                    form.setValue("district_id", "");
                  }}
                  onSelectedValueCallback={(value) => {
                    setFullAddressInfo((prev) => {return {...prev, cityLabel: value?.label || ""}});
                  }}
                  items={optionsCity}
                  placeholder={"Chọn Tỉnh/ Thành phố"}
                  emptyMessage="Không tìm thấy nội dung"
                  disabled={isLoading}
                  endAdornment={isLoading ? <LoadingSpinner/> : null}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district_id"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel><span className="text-red-600">*</span> Quận/ Huyện</FormLabel>
                <AutoComplete
                  selectedValue={field.value}
                  onSelectedValueChange={(value) => {
                    field.onChange(value?.value || "");
                    setFullAddressInfo((prev) => {return {...prev, districtLabel: value?.label || ""}});
                    form.setValue("ward_id", "");
                    form.setValue("street_id", "");
                    form.setValue("project_id", "");
                  }}
                  onSelectedValueCallback={(value) => {
                    setFullAddressInfo((prev) => {return {...prev, districtLabel: value?.label || ""}});
                  }}
                  items={optionsDistrict}
                  placeholder={"Chọn Quận/ Huyện"}
                  emptyMessage="Không tìm thấy nội dung"
                  disabled={isLoading || (city_id ? false : true)}
                  endAdornment={isLoading ? <LoadingSpinner/> : null}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ward_id"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Phường/ Xã</FormLabel>
                <AutoComplete
                  selectedValue={field.value || ""}
                  onSelectedValueChange={(value) => {
                    field.onChange(value?.value || "");
                    setFullAddressInfo((prev) => {return {...prev, wardLabel: value?.label || ""}});
                  }}
                  onSelectedValueCallback={(value) => {
                    setFullAddressInfo((prev) => {return {...prev, wardLabel: value?.label || ""}});
                  }}
                  items={optionsWard}
                  placeholder={"Chọn Phường/ Xã"}
                  emptyMessage="Không tìm thấy nội dung"
                  disabled={isLoading || (district_id ? false : true)}
                  endAdornment={isLoading ? <LoadingSpinner/> : null}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street_id"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Đường/ Phố</FormLabel>
                <AutoComplete
                  selectedValue={field.value || ""}
                  onSelectedValueChange={(value) => {
                    field.onChange(value?.value || "");
                    setFullAddressInfo((prev) => {return {...prev, streetLabel: value?.label || ""}});
                  }}
                  onSelectedValueCallback={(value) => {
                    setFullAddressInfo((prev) => {return {...prev, streetLabel: value?.label || ""}});
                  }}
                  items={optionsStreet}
                  placeholder={"Chọn Đường/ Phố"}
                  emptyMessage="Không tìm thấy nội dung"
                  disabled={isLoading || (district_id ? false : true)}
                  endAdornment={isLoading ? <LoadingSpinner/> : null}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Dự án</FormLabel>
                <AutoComplete
                  selectedValue={field.value || ""}
                  onSelectedValueChange={(value) => {
                    field.onChange(value?.value || "");
                    setFullAddressInfo((prev) => {return {...prev, projectLabel: value?.label || ""}});
                  }}
                  onSelectedValueCallback={(value) => {
                    setFullAddressInfo((prev) => {return {...prev, projectLabel: value?.label || ""}});
                  }}
                  items={optionsProject}
                  placeholder={"Chọn Dự án"}
                  emptyMessage="Không tìm thấy nội dung"
                  disabled={isLoading || (district_id ? false : true)}
                  endAdornment={isLoading ? <LoadingSpinner/> : null}
                />
              </FormItem>
            )}
          />

          <div className="grid gap-2">
            <Label htmlFor="subject">Địa chỉ cụ thể</Label>
            <Input id="subject" placeholder="Nhập Địa chỉ..." value={fullAddressInfo.addressText}
              onChange={(e) => setFullAddressInfo(prev => {return {...prev, addressText: e.target.value}})}
            />
          </div>
        </div>

        <div className="rounded-lg bg-secondary border border-solid border-[#c8c8cd] p-2 flex flex-col gap-y-5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <CircleAlert />
              <span className="font-medium text-grey-900">Địa chỉ hiển thị trên tin đăng</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms"
                checked={isHideFullAddress}
                onCheckedChange={(value) => {setIsHideFullAddress(value as boolean)}}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ẩn địa chỉ
              </label>
            </div>
          </div>
          <span className="text-grey-900 text-fs-14">
            {fullAddress}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationForm;
