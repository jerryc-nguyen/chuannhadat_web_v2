import { genKey } from '@common/utils';
import { IProductDetail } from '@mobile/searchs/type';
import React from 'react';

type DescriptionPostProps = {
  data: IProductDetail;
};

const DescriptionPost: React.FC<DescriptionPostProps> = ({ data }) => {
  return (
    <div className="description flex flex-col gap-1 rounded-xl bg-white p-8">
      <h3 className="pb-5 text-xl font-semibold">Mô tả chi tiết</h3>
      {data?.description &&
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
        })}
    </div>
  );
};

export default DescriptionPost;
