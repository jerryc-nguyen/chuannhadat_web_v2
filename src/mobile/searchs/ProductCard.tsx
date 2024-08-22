/* eslint-disable @next/next/no-img-element */
import * as AspectRatio from '@radix-ui/react-aspect-ratio';

import { IoImage } from 'react-icons/io5';
import useResizeImage from '@hooks/useResizeImage';

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

export default function ProductCard({
  product,
}: {
  product: A;
}) {
  const { buildThumbnailUrl } = useResizeImage();
  return (
    <div className="m-4 overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md">
      <AspectRatio.Root ratio={16 / 9}>
        <img
          className="Image"
          src={buildThumbnailUrl({
            imageUrl: product?.featured_image_url,
          })}
          alt={product?.name}
        />

        <div style={styles.imagesCountWrapper}>
          <div
            style={styles.imagesCount}
            className="flex items-center justify-between px-2 py-1"
          >
            {/* <IoPlayCircleOutline
              name='play-circle-outline'
              size={20}
              style={{ color: '#fff' }}
            /> */}
            <div
              className="flex items-center justify-start"
              style={{ marginLeft: 5 }}
            >
              <IoImage
                size={20}
                style={{ color: '#fff' }}
              />
              <span
                style={{ color: '#fff', marginLeft: 5 }}
              >
                1
              </span>
            </div>
          </div>
        </div>
      </AspectRatio.Root>

      <div className="p-4">
        <h3 className="mb-2 text-slate-600 font-bold">
          {product?.title}
        </h3>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-start justify-center">
            <span className="font-semibold text-xl">
              {product?.formatted_price}
            </span>
            <span className="text-slate-600 text-sm">
              {product?.formatted_price_per_m2}
            </span>
          </div>

          <div className="flex flex-col items-start justify-center">
            <span className="font-semibold text-xl">
              {product?.formatted_area}
            </span>
            <span className="text-slate-600 text-sm">
              {product?.formatted_kt || '...'}
            </span>
          </div>

          <div className="flex flex-col items-start justify-center">
            <div className="flex justify-center items-center">
              <img
                src="https://spaces.chuannhadat.com/icons/bed_icon.svg"
                width="16"
                alt=""
              />
              <span className="ml-2">
                {product?.bedrooms_count}
              </span>
            </div>

            <div className="flex justify-center items-center">
              <img
                src="https://spaces.chuannhadat.com/icons/bath_icon.svg"
                width="16"
                alt=""
              />
              <span className="ml-2">
                {product?.bathrooms_count}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between mt-3">
          <div className="text-slate-600">
            {product?.short_location_name}
          </div>
          <div className="text-slate-600">
            {product?.formatted_publish_at}
          </div>
        </div>
      </div>
    </div>
  );
}
