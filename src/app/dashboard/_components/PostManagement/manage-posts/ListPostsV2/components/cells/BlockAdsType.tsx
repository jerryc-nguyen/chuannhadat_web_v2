import { ADS_TYPES } from '@common/constants';
import { cn } from '@common/utils';

interface BlockAdsTypeProps {
  ads_type: string;
  expires_after_days: string;
  className?: string;
}

export function BlockAdsType({ ads_type, expires_after_days, className }: BlockAdsTypeProps) {
  return (
    <div className={cn(`flex flex-col gap-1 ${ads_type}`, className)}>
      <span className="font-medium">Loại tin:</span>
      <span className='flex gap-1'>
        <span className="c-ads_color font-bold">{ADS_TYPES[ads_type]}</span>
        {expires_after_days && ads_type !== 'normal' ? (
          <>
            <span className="hidden text-secondary md:block">{` (hết hạn sau ${expires_after_days})`}</span>
            <span className="block text-secondary md:hidden">{` (còn ${expires_after_days})`}</span>
          </>
        ) : (
          <></>
        )}
      </span>
    </div>
  );
}
