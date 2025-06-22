import { Skeleton } from '@components/ui/skeleton';
import { IProductDetail } from '@mobile/searchs/type';
import React from 'react';

type FeaturesPostProps = {
  data?: IProductDetail;
  isLoading?: boolean;
};

export const FeaturesList = ({ data }: FeaturesPostProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      {data?.full_address && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Địa chỉ</span>
          <span className="text-md text-secondary">{data?.full_address}</span>
        </div>
      )}

      {data?.formatted_price && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Giá</span>
          <span className="text-sm text-secondary">{data?.formatted_price}</span>
        </div>
      )}

      {data?.formatted_area && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Diện tích</span>
          <span className="text-sm text-secondary">{data?.formatted_area}</span>
        </div>
      )}

      {data?.formatted_price_per_m2 && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Giá / m2</span>
          <span className="text-sm text-secondary">{data?.formatted_price_per_m2}</span>
        </div>
      )}

      {data?.formatted_facade && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Mặt tiền</span>
          <span className="text-sm text-secondary">{data?.formatted_facade}</span>
        </div>
      )}

      {data?.formatted_kt && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Kích thước</span>
          <span className="text-sm text-secondary">{data?.formatted_kt}</span>
        </div>
      )}

      {/* Only show bedrooms if value is greater than 0 */}
      {parseInt(data?.bedrooms_count + '') > 0 && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Số phòng ngủ</span>
          <span className="text-md text-secondary">{data?.bedrooms_count}</span>
        </div>
      )}

      {/* Only show bathrooms if value is greater than 0 */}
      {parseInt(data?.bathrooms_count + '') > 0 && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Số phòng tắm</span>
          <span className="text-md text-secondary">{data?.bathrooms_count}</span>
        </div>
      )}

      {data?.formatted_entrance && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Đường rộng</span>
          <span className="text-sm text-secondary">{data?.formatted_entrance}</span>
        </div>
      )}

      {/* Only show floors if value is greater than 0 */}
      {data?.floors_count && Number(data.floors_count) > 0 && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Số tầng</span>
          <span className="text-md text-secondary">{data?.floors_count}</span>
        </div>
      )}

      {data?.formatted_direction && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Hướng</span>
          <span className="text-sm text-secondary">{data?.formatted_direction}</span>
        </div>
      )}

      {data?.formatted_furniture && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Nội thất</span>
          <span className="text-sm text-secondary">
            {data?.formatted_furniture}
          </span>
        </div>
      )}

      {data?.formatted_phap_ly && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Pháp lý</span>
          <span className="text-black-500 font-bold">
            {data?.formatted_phap_ly}
          </span>
        </div>
      )}

      {data?.formatted_publish_at && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Ngày đăng</span>
          <span className="text-md text-secondary">{data?.formatted_publish_at}</span>
        </div>
      )}
    </div>
  );
};
const renderLoadingFeatures = () => (
  <div className="flex flex-col gap-y-2">
    <div className="flex gap-1">
      <span className="min-w-[8rem] text-sm font-semibold">Địa chỉ</span>
      <Skeleton className="h-4 w-2/3" />
    </div>

    <div className="flex gap-1">
      <span className="min-w-[8rem] text-sm font-semibold">Giá / m2</span>
      <Skeleton className="h-4 w-[80px]" />
    </div>
    <div className="flex gap-1">
      <span className="min-w-[8rem] text-sm font-semibold">Số phòng ngủ</span>
      <Skeleton className="h-4 w-6" />
    </div>

    <div className="flex gap-1">
      <span className="min-w-[8rem] text-sm font-semibold">Số phòng tắm</span>
      <Skeleton className="h-4 w-6" />
    </div>

    <div className="flex gap-1">
      <span className="min-w-[8rem] text-sm font-semibold">Pháp lý</span>
      <Skeleton className="h-4 w-[120px]" />
    </div>

    <div className="flex gap-1">
      <span className="min-w-[8rem] text-sm font-semibold">Ngày đăng</span>
      <Skeleton className="h-4 w-[150px]" />
    </div>
  </div>
);
const FeaturesPost: React.FC<FeaturesPostProps> = ({ data, isLoading }) => {
  return (
    <div className="features-estate rounded-lg border bg-white p-6">
      <h3 className="pb-5 text-xl font-semibold">Đặc điểm của bất động sản</h3>
      {isLoading ? renderLoadingFeatures() : <FeaturesList data={data} />}
    </div>
  );
};

export default FeaturesPost;
