import FormatHtml from '@components/FormatHtml';
import { IProductDetail } from '@mobile/searchs/type';
import React from 'react';

type DescriptionPostProps = {
  data: IProductDetail;
  isLoading?: boolean;
};

const DescriptionPost: React.FC<DescriptionPostProps> = ({ data, isLoading }) => {
  return (
    <div className="description flex flex-col gap-1 rounded-xl border bg-white p-6">
      <h3 className="pb-5 text-xl font-semibold">Mô tả chi tiết</h3>
      <FormatHtml content={data?.description || ''} />
    </div>
  );
};

export default DescriptionPost;
