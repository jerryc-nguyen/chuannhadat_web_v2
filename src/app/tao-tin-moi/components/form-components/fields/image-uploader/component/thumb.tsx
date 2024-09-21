import { useEffect, useState } from 'react';
import { CircleX } from 'lucide-react';
import { CNDImage } from '@app/tao-tin-moi/type';
import ImageWithFallback from '@components/image-with-fallback';
import ImageUploadApiService from '@app/tao-tin-moi/apis/image-upload-api';

interface IPreviewThumb {
  image: CNDImage;
}
const PreviewThumb: React.FC<IPreviewThumb> = ({ image }) => {
  const [cndImage, setCndImage] = useState<CNDImage>(image);
  const [currentUploadProgress, setCurrentUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleUploadImage = (file: CNDImage) => {
    console.log("start handleUploadImage", file);
    
    if (file.id || !file.uploadedFile) return;
    console.log("start handleUploadImage ready");
    setIsUploading(true);

    const uploadPromises = ImageUploadApiService.upload([file.uploadedFile], (val) => {
      setCurrentUploadProgress(val);
    });

    Promise.all(uploadPromises)
      .then((results) => {
        results.forEach((result) => {
          setCndImage((prev) => ({
            ...prev,
            url: result.url,
            id: result.id,
          }));
          
          // nếu là file vừa mới tải lên
          // => view tạm bằng url blob
          // => gọi api upload
          // => upload thành công thì thay url blob đó bằng url thật
          // => giải phóng memory cái ảnh tạm ở phía client
          URL.revokeObjectURL(cndImage.url);
        });
      })
      .catch((err) => {
        console.error('Error in one or more uploads:', err);
        setIsError(true);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  useEffect(() => {
    handleUploadImage(cndImage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative group inline-flex h-24 w-24 cursor-grab rounded-lg border-2 border-secondary p-2 transition-transform duration-300 hover:scale-110">
      <div className="w-full image-fill-wrapper relative rounded-lg overflow-hidden flex items-center justify-center flex-col bg-grey-50 duration-300">
        <ImageWithFallback
          className="block h-full w-auto"
          src={cndImage.url}
          alt={`Hình ảnh ${cndImage.id}`}
          fill
          onTriggerErrorCallback={() => {
            setIsError(false);
            handleUploadImage(cndImage);
          }}
          isError={isError}
          setIsError={setIsError}
        />
        <CircleX className="absolute right-0 top-0 z-10 text-[#596570] opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer" />
      </div>

      {
        isUploading ? (
          <div className="bg-black/10 rounded-full w-[4.8rem] absolute top-1/2 transform -translate-y-1/2">
            <div className="bg-black/40 text-fs-12 font-medium text-blue-100 text-center py-0.5 leading-none rounded-full duration-300"
              style={{width: `${currentUploadProgress}%`}}>
            </div>
          </div>
        ) : <></>
      }

    </div>
  );
};

export default PreviewThumb;
