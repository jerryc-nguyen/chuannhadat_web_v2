import { ADS_TYPES } from '@common/constants';
import { cn } from '@common/utils';

interface BlockAdsTypeProps {
  ads_type: string;
  expires_after_days: string;
  className?: string;
}

export function BlockAdsType({ ads_type, expires_after_days, className }: BlockAdsTypeProps) {
  return (
    <div className={cn(`inline-flex items-center gap-1 px-2 py-1 font-medium border rounded-full ${ads_type}`, className)}>
      <span className="c-ads_color font-bold">{ADS_TYPES[ads_type]}</span>
      {expires_after_days && ads_type !== 'normal' && (
        <span className="text-secondary text-xs">{`còn ${expires_after_days}`}</span>
      )}
    </div>
  );
}
