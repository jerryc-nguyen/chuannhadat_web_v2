/**
 * Optimized LocationsPicker Component
 * 
 * Example migration from static JSON imports to dynamic loading.
 * This replaces 4MB of immediate loading with progressive on-demand loading.
 */

import React, { useState, useEffect } from 'react';
import { useLocationData } from '@hooks/useLocationData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { LoadingSpinner } from '@components/icons/CustomIcons';

interface OptimizedLocationsPickerProps {
  onCityChange?: (cityId: string) => void;
  onDistrictChange?: (districtId: string) => void;
  onWardChange?: (wardId: string) => void;
  onStreetChange?: (streetId: string) => void;
  defaultValues?: {
    cityId?: string;
    districtId?: string;
    wardId?: string;
    streetId?: string;
  };
  showStreets?: boolean;
  showProjects?: boolean;
}

export default function OptimizedLocationsPicker({
  onCityChange,
  onDistrictChange,
  onWardChange,
  onStreetChange,
  defaultValues = {},
  showStreets = false,
  showProjects = false,
}: OptimizedLocationsPickerProps) {

  // Use the dynamic location data hook
  const {
    cities,
    districts,
    wards,
    streets,
    projects,
    loading,
    error,
    loadDistricts,
    loadWards,
    loadStreets,
    loadProjects,
    reset,
  } = useLocationData();

  // Local state for selected values
  const [selectedCity, setSelectedCity] = useState(defaultValues.cityId || '');
  const [selectedDistrict, setSelectedDistrict] = useState(defaultValues.districtId || '');
  const [selectedWard, setSelectedWard] = useState(defaultValues.wardId || '');
  const [selectedStreet, setSelectedStreet] = useState(defaultValues.streetId || '');

  // Load initial data based on default values
  useEffect(() => {
    if (defaultValues.cityId) {
      loadDistricts(defaultValues.cityId);
    }
    if (defaultValues.districtId) {
      loadWards(defaultValues.districtId);
      if (showStreets) loadStreets(defaultValues.districtId);
      if (showProjects) loadProjects(defaultValues.districtId);
    }
  }, [defaultValues, loadDistricts, loadWards, loadStreets, loadProjects, showStreets, showProjects]);

  // Handle city selection
  const handleCityChange = async (cityId: string) => {
    setSelectedCity(cityId);
    setSelectedDistrict('');
    setSelectedWard('');
    setSelectedStreet('');

    if (cityId) {
      await loadDistricts(cityId);
    } else {
      reset();
    }

    onCityChange?.(cityId);
  };

  // Handle district selection
  const handleDistrictChange = async (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedWard('');
    setSelectedStreet('');

    if (districtId) {
      // Load wards and optionally streets/projects in parallel
      const promises = [loadWards(districtId)];
      if (showStreets) promises.push(loadStreets(districtId));
      if (showProjects) promises.push(loadProjects(districtId));

      await Promise.all(promises);
    }

    onDistrictChange?.(districtId);
  };

  // Handle ward selection
  const handleWardChange = (wardId: string) => {
    setSelectedWard(wardId);
    setSelectedStreet('');
    onWardChange?.(wardId);
  };

  // Handle street selection
  const handleStreetChange = (streetId: string) => {
    setSelectedStreet(streetId);
    onStreetChange?.(streetId);
  };

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <LoadingSpinner className="h-4 w-4" />
      Đang tải...
    </div>
  );

  // Error display
  if (error) {
    return (
      <div className="text-red-500 text-sm">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* City Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Tỉnh/Thành phố
        </label>
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger>
            <SelectValue placeholder={loading.cities ? "Đang tải..." : "Chọn tỉnh/thành phố"} />
          </SelectTrigger>
          <SelectContent>
            {loading.cities ? (
              <div className="p-2">
                <LoadingIndicator />
              </div>
            ) : (
              cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* District Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Quận/Huyện
        </label>
        <Select
          value={selectedDistrict}
          onValueChange={handleDistrictChange}
          disabled={!selectedCity || loading.districts}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !selectedCity ? "Chọn tỉnh/thành phố trước" :
                loading.districts ? "Đang tải..." :
                  "Chọn quận/huyện"
            } />
          </SelectTrigger>
          <SelectContent>
            {loading.districts ? (
              <div className="p-2">
                <LoadingIndicator />
              </div>
            ) : (
              districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Ward Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Phường/Xã
        </label>
        <Select
          value={selectedWard}
          onValueChange={handleWardChange}
          disabled={!selectedDistrict || loading.wards}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !selectedDistrict ? "Chọn quận/huyện trước" :
                loading.wards ? "Đang tải..." :
                  "Chọn phường/xã"
            } />
          </SelectTrigger>
          <SelectContent>
            {loading.wards ? (
              <div className="p-2">
                <LoadingIndicator />
              </div>
            ) : (
              wards.map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  {ward.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Street Selector (optional) */}
      {showStreets && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Đường/Phố
          </label>
          <Select
            value={selectedStreet}
            onValueChange={handleStreetChange}
            disabled={!selectedDistrict || loading.streets}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !selectedDistrict ? "Chọn quận/huyện trước" :
                  loading.streets ? "Đang tải..." :
                    "Chọn đường/phố"
              } />
            </SelectTrigger>
            <SelectContent>
              {loading.streets ? (
                <div className="p-2">
                  <LoadingIndicator />
                </div>
              ) : (
                streets.map((street) => (
                  <SelectItem key={street.id} value={street.id}>
                    {street.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Projects (optional) */}
      {showProjects && projects.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Dự án
          </label>
          <Select disabled={loading.projects}>
            <SelectTrigger>
              <SelectValue placeholder={
                loading.projects ? "Đang tải..." : "Chọn dự án"
              } />
            </SelectTrigger>
            <SelectContent>
              {loading.projects ? (
                <div className="p-2">
                  <LoadingIndicator />
                </div>
              ) : (
                projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-4">
          <details>
            <summary>Debug Info</summary>
            <pre className="mt-2 text-xs">
              {JSON.stringify({
                selectedCity,
                selectedDistrict,
                selectedWard,
                selectedStreet,
                loading,
                counts: {
                  cities: cities.length,
                  districts: districts.length,
                  wards: wards.length,
                  streets: streets.length,
                  projects: projects.length,
                }
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
