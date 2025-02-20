import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Product } from '../../data/schemas/product-schema';
import { ADS_TYPES } from '@common/constants';

export const CellStatus: ColumnDef<Product>['cell'] = ({ row }) => {
  const id = row.original.id;
  // const productUid = row.original.uid;
  const detail_path = row.original.detail_path;
  const formatted_created_at = row.original.formatted_created_at;
  const formatted_published_at = row.original.formatted_published_at;
  const ads_type = row.original.ads_type;
  const expires_after_days = row.original.expires_after_days;

  return (
    <div className="flex min-h-[180px] w-max flex-col gap-1">
      <span className="text-xs">
        <span className="mb-2 font-medium">Mã tin:</span>
        <Link
          className="ml-2 cursor-pointer text-blue-600 hover:text-blue-900"
          href={`${detail_path}`}
        >
          #{id}
        </Link>
      </span>

      <div className="flex flex-col gap-1 text-xs">
        <span className="font-medium">Ngày đăng:</span>
        <span className="text-secondary">{formatted_created_at}</span>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <span className="font-medium">Ngày làm mới:</span>
        <span className="text-secondary">{formatted_published_at}</span>
      </div>

      <div className={`flex flex-col gap-1 text-xs ${ads_type}`}>
        <span className="font-medium">Loại tin:</span>
        <span>
          <span className='c-ads_color font-bold'>
            {ADS_TYPES[ads_type]}
          </span>
          {expires_after_days && ads_type !== 'normal' ? (
            <span className="text-secondary">{` (hết hạn sau ${expires_after_days})`}</span>
          ) : (
            <></>
          )}
        </span>
      </div>
    </div>
  );
};
