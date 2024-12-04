import { useState } from 'react';
import ImageWithFallback from '@components/image-with-fallback';
import { IUploadedImage } from '../types';
import { twMerge } from 'tailwind-merge';

interface IPreviewThumb {
  image: IUploadedImage;
}
const PreviewThumb: React.FC<IPreviewThumb> = ({ image }) => {
  const [isError, setIsError] = useState<boolean>(image.hasError || false);

  return (
    <div className={twMerge("relative group inline-flex cursor-grab rounded-lg border-2 border-secondary p-2 transition-transform duration-300 hover:scale-110", "h-36 w-36 md:h-52 md:w-52")}>
      <div className="w-full image-fill-wrapper relative rounded-lg overflow-hidden flex items-center justify-center flex-col bg-grey-50 duration-300">
        <ImageWithFallback
          className="block h-full w-auto object-cover"
          src={image.url}
          alt={`Hình ảnh ${image.id}`}
          fill
          onTriggerErrorCallback={() => {
            setIsError(false);
          }}
          isError={isError}
          setIsError={setIsError}
        />

        {
          image.uploading ? (
            <div className="bg-black/10 rounded-full w-[90%] absolute top-1/2 transform -translate-y-1/2">
              <div className="bg-white/60 text-fs-12 font-medium text-blue-100 text-center py-2 leading-none rounded-full duration-300 "
                style={{ width: `${image.progress}%` }}>
              </div>
            </div>
          ) : <></>
        }
      </div>
    </div>
  );
};

export default PreviewThumb;
