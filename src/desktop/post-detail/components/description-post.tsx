import { formatRealEstateText } from '@common/stringHelpers';
import { genKey } from '@common/utils';
import { Skeleton } from '@components/ui/skeleton';
import { IProductDetail } from '@mobile/searchs/type';
import React from 'react';

type DescriptionPostProps = {
  data: IProductDetail;
  isLoading?: boolean;
};

const DescriptionPost: React.FC<DescriptionPostProps> = ({ data, isLoading }) => {
  const renderLoadingDescription = () => {
    return (
      <div className="flex flex-col gap-y-2">
        {new Array(10).fill(0).map((_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
    );
  };
  const renderContentDescription = () =>
    data?.description &&
    data?.description.split('\r\n').map((line: string, index: number) => {
      if (line.trim() === '') return null;
      if (!line.startsWith('•')) {
        return <p key={genKey(index)}>{line}</p>;
      } else {
        const newLine = line.replace('•', '');
        return (
          <li className="list-item pl-3" key={genKey(index)}>
            {newLine}
          </li>
        );
      }
    });
  return (
    <div className="description flex flex-col gap-1 rounded-xl border bg-white p-6">
      <h3 className="pb-5 text-xl font-semibold">Mô tả chi tiết</h3>
      {isLoading ? renderLoadingDescription() : <div>{renderContentDescription()}</div>}
    </div>
  );
};

export default DescriptionPost;
