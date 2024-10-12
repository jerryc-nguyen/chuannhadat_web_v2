import { IProductDetail } from '@mobile/searchs/type';
import React from 'react';

type FeaturesPostProps = {
  data?: IProductDetail;
};

export const FeaturesList = ({ data }: FeaturesPostProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      {data?.full_address && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold text-slate-500">Địa chỉ</span>
          <span className="text-md text-slate-600">{data?.full_address}</span>
        </div>
      )}

      {data?.formatted_price_per_m2 && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold text-slate-500">Giá / m2</span>
          <span className="text-sm text-slate-600">{data?.formatted_price_per_m2}</span>
        </div>
      )}
      {data?.bedrooms_count && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold text-slate-500">Số phòng ngủ</span>
          <span className="text-md text-slate-600">{data?.bedrooms_count ?? 1}</span>
        </div>
      )}

      {data?.bathrooms_count && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold text-slate-500">Số phòng tắm</span>
          <span className="text-md text-slate-600">{data?.bathrooms_count}</span>
        </div>
      )}
      {data?.floors_count && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold text-slate-500">Số tầng</span>
          <span className="text-md text-slate-600">{data?.floors_count}</span>
        </div>
      )}

      {data?.phap_ly && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold text-slate-500">Pháp lý</span>
          <span className="text-md text-slate-600">
            {data?.phap_ly ? 'Sổ hồng/sổ đỏ' : 'Chưa có sổ'}
          </span>
        </div>
      )}

      {data?.formatted_publish_at && (
        <div className="flex gap-1">
          <span className="min-w-[8rem] text-sm font-semibold text-slate-500">Ngày đăng</span>
          <span className="text-md text-slate-600">{data?.formatted_publish_at}</span>
        </div>
      )}
    </div>
  )
}

const FeaturesPost: React.FC<FeaturesPostProps> = ({ data }) => {
  return (
    <div className="features-estate rounded-lg border bg-white p-6">
      <h3 className="pb-5 text-xl font-semibold">Đặc điểm của bất động sản</h3>
      <FeaturesList data={data} />
    </div>
  );
};

export default FeaturesPost;
