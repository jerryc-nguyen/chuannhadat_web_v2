import { LocationFilterProps } from '../types/pure-ui-types';
import { OptionForSelect } from '@common/types';

/**
 * Pure UI component for location filtering (city, district, ward)
 * Receives all state via props and communicates changes via callbacks
 */
export default function LocationFilter({
  city,
  district,
  ward,
  cityOptions,
  districtOptions,
  wardOptions,
  onLocationChange,
  loading = {},
}: LocationFilterProps) {
  const handleCityChange = (selectedCity: OptionForSelect | undefined) => {
    onLocationChange({
      city: selectedCity,
      district: undefined, // Reset district when city changes
      ward: undefined, // Reset ward when city changes
    });
  };

  const handleDistrictChange = (selectedDistrict: OptionForSelect | undefined) => {
    onLocationChange({
      city,
      district: selectedDistrict,
      ward: undefined, // Reset ward when district changes
    });
  };

  const handleWardChange = (selectedWard: OptionForSelect | undefined) => {
    onLocationChange({
      city,
      district,
      ward: selectedWard,
    });
  };

  return (
    <div className="space-y-4">
      {/* City Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tỉnh/Thành phố
        </label>
        <select
          value={city?.value || ''}
          onChange={(e) => {
            const selectedOption = cityOptions.find(option => option.value === e.target.value);
            handleCityChange(selectedOption);
          }}
          disabled={loading.cities}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Chọn tỉnh/thành phố</option>
          {cityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        {loading.cities && (
          <div className="mt-1 text-sm text-gray-500">Đang tải...</div>
        )}
      </div>

      {/* District Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quận/Huyện
        </label>
        <select
          value={district?.value || ''}
          onChange={(e) => {
            const selectedOption = districtOptions.find(option => option.value === e.target.value);
            handleDistrictChange(selectedOption);
          }}
          disabled={!city || loading.districts}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        >
          <option value="">Chọn quận/huyện</option>
          {districtOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        {loading.districts && (
          <div className="mt-1 text-sm text-gray-500">Đang tải...</div>
        )}
      </div>

      {/* Ward Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phường/Xã
        </label>
        <select
          value={ward?.value || ''}
          onChange={(e) => {
            const selectedOption = wardOptions.find(option => option.value === e.target.value);
            handleWardChange(selectedOption);
          }}
          disabled={!district || loading.wards}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        >
          <option value="">Chọn phường/xã</option>
          {wardOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        {loading.wards && (
          <div className="mt-1 text-sm text-gray-500">Đang tải...</div>
        )}
      </div>
    </div>
  );
}