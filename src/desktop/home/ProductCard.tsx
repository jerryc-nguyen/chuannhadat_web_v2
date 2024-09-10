/* eslint-disable @next/next/no-img-element */
import * as AspectRatio from '@radix-ui/react-aspect-ratio';

import { IoImage } from 'react-icons/io5';
import useResizeImage from '@hooks/useResizeImage';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';

import { LuMoreHorizontal } from 'react-icons/lu';
import CardAuthor from './CardAuthor';

const styles: A = {
  imagesCountWrapper: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    height: 35,
  },
  imagesCount: {
    backgroundColor: 'rgba(0,0,0,.3)',
    display: 'flex',
    borderRadius: 20,
  },
};

const DEFAULT_THUMB_IMAGE =
  'https://images.chuannhadat.com/images/placeholders/list-item-placeholder.png';

export default function ProductCard({ product }: { product: A }) {
  const { buildThumbnailUrl } = useResizeImage();
  return (
    <div className="shadow-2 rounded-lg bg-white dark:bg-slate-800">
      <CardAuthor product={product} />
      <AspectRatio.Root ratio={16 / 9}>
        <img
          className="Image"
          src={buildThumbnailUrl({
            imageUrl: product?.featured_image_url || DEFAULT_THUMB_IMAGE,
          })}
          alt={product?.name}
        />

        <div style={styles.imagesCountWrapper}>
          <div style={styles.imagesCount} className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center justify-start" style={{ marginLeft: 5 }}>
              <IoImage size={20} style={{ color: '#fff' }} />
              <span style={{ color: '#fff', marginLeft: 5 }}>{product?.images_count}</span>
            </div>
          </div>
        </div>
      </AspectRatio.Root>

      <div className="p-4">
        <h3 className="limit-2-line mb-2 font-bold text-slate-600">{product?.title}</h3>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-start justify-center">
            <span className="text-xl font-semibold">{product?.formatted_price}</span>
            <span className="text-sm text-slate-600">{product?.formatted_price_per_m2}</span>
          </div>

          <div className="flex flex-col items-start justify-center">
            <span className="text-xl font-semibold">{product?.formatted_area}</span>
            <span className="text-sm text-slate-600">{product?.formatted_kt || '...'}</span>
          </div>

          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-center">
              <img src="https://spaces.chuannhadat.com/icons/bed_icon.svg" width="16" alt="" />
              <span className="ml-2">{product?.bedrooms_count}</span>
            </div>

            <div className="flex items-center justify-center">
              <img src="https://spaces.chuannhadat.com/icons/bath_icon.svg" width="16" alt="" />
              <span className="ml-2">{product?.bathrooms_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
