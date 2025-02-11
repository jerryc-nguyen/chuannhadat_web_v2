import React, { useEffect, useState, CSSProperties, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@components/ui/button';
import ThumbDragAndDropZone from './component/thumbs-container';
import { IUploadedImage } from './types';
import ImageUploadApiService, { UploadFolders } from '@components/image-uploader/apis';
import Image from 'next/image';
import { TPhoto } from '@models';

const baseStyle: CSSProperties = {
  alignItems: 'center',
  padding: '20px',
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle: CSSProperties = {
  borderColor: '#2196f3',
};

const acceptStyle: CSSProperties = {
  borderColor: '#00e676',
};

const rejectStyle: CSSProperties = {
  borderColor: '#ff1744',
};

interface IImageUploader {
  uploadedImages: IUploadedImage[];
  onUploaded: (images: IUploadedImage[]) => void;
}

export const convertToUploadedImages = (images: TPhoto[]): IUploadedImage[] => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map((img: TPhoto) => {
    return {
      ...img,
      process: 100,
      uploading: false,
    };
  });
};

const ImageUploader: React.FC<IImageUploader> = ({ uploadedImages, onUploaded }) => {
  const sumImageId = uploadedImages.reduce((acc, item) => {
    return acc + parseInt(item.id + '');
  }, 0);
  const [images, setImages] = useState<IUploadedImage[]>(uploadedImages);

  useEffect(() => {
    setImages(uploadedImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumImageId]);
  const handleOnChange = (newImages: IUploadedImage[]) => {
    const uploadedImgs = newImages.filter((item) => {
      return parseInt(item.id + '') && parseInt(item.id + '') > 0;
    });
    onUploaded(uploadedImgs);
  };

  const updateUploadProgress = (file: File, progress: number) => {
    setImages((oldImages: IUploadedImage[]) => {
      return oldImages.map((img: IUploadedImage) => {
        // @ts-ignore: check new attr
        if (img.id == file.new_id) {
          return {
            ...img,
            uploading: true,
            progress: progress,
          };
        } else {
          return img;
        }
      });
    });
  };

  const handleUploadCompleted = (result: A) => {
    setImages((oldImages: IUploadedImage[]) => {
      const newImages = oldImages.map((img: IUploadedImage) => {
        // @ts-ignore: check new attr
        const matched = img.uploadedFile && img.uploadedFile.new_id == result.file?.new_id;
        const uploaded = oldImages.filter((item) => item.id == result.id).length > 0;
        if (matched && !uploaded) {
          return {
            ...img,
            uploading: false,
            progress: 100,
            id: result.id,
          };
        } else {
          return img;
        }
      });
      handleOnChange(newImages);
      return newImages;
    });
  };

  const uploadImagesHandler = (files: File[]) => {
    const uploadPromises = ImageUploadApiService.upload(
      UploadFolders.PRODUCT_IMAGES,
      files,
      (file, progress) => {
        // console.log(`Uploading ${file.name}: ${progress}`)
        updateUploadProgress(file, progress);
      },
    );

    uploadPromises.forEach((uploading) => {
      uploading
        .then((result) => {
          handleUploadCompleted(result);
        })
        .catch((err) => {
          console.error('Error in one or more uploads:', err);
        });
    });
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (files: File[]) => {
      const newImages = files.map((file) => {
        // use file blob source as the uploading id
        const newId = URL.createObjectURL(file);

        // @ts-ignore: add new attr
        file.new_id = newId;

        const img = {
          id: newId,
          url: URL.createObjectURL(file),
          uploadedFile: file,
          progress: 10,
        };
        return img;
      });
      setImages((prev) => [...prev, ...(newImages as IUploadedImage[])]);
      uploadImagesHandler(files);
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  const onImagesChanged = (images: IUploadedImage[]) => {
    setImages(images);
    onUploaded(images);
    // debugImagesNth()
  };

  // const debugImagesNth = () => {
  //   const imageIds = images.map((item) => item.id);
  //   console.log('debugImagesNth', imageIds)
  // }

  useEffect(() => {
    if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
      onUploaded(uploadedImages);
    }
  }, []);

  return (
    <section className="">
      <div
        {...getRootProps({
          className:
            'flex flex-1 flex-col cursor-pointer border-2 rounded-lg border bg-secondary text-secondary',
          style: style,
        })}
      >
        <input {...getInputProps()} />
        <span className="flex flex-col items-center gap-4">
          <Image src={'/upload_image.svg'} alt={'upload_image_prompt'} width={100} height={100} />
          <p className="text-lg">Kéo thả tối thiểu 1 ảnh vào đây hoặc</p>
          <Button type="button">Bấm để tải ảnh</Button>
        </span>
      </div>

      <ThumbDragAndDropZone images={images} onChange={onImagesChanged} />
    </section>
  );
};

export default ImageUploader;
