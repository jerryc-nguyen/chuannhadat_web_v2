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

      {data?.formatted_price_per_m2 && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Giá / m2</span>
          <span className="text-sm text-secondary">{data?.formatted_price_per_m2}</span>
        </div>
      )}
      {data?.bedrooms_count && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Số phòng ngủ</span>
          <span className="text-md text-secondary">{data?.bedrooms_count ?? 1}</span>
        </div>
      )}

      {data?.bathrooms_count && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Số phòng tắm</span>
          <span className="text-md text-secondary">{data?.bathrooms_count}</span>
        </div>
      )}
      {data?.floors_count && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Số tầng</span>
          <span className="text-md text-secondary">{data?.floors_count}</span>
        </div>
      )}

      {data?.phap_ly && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold">Pháp lý</span>
          <span className="text-md text-secondary">
            {data?.phap_ly ? 'Sổ hồng/sổ đỏ' : 'Chưa có sổ'}
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
