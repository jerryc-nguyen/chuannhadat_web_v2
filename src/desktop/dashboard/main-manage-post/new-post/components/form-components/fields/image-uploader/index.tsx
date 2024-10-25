import React, { useEffect, useState, CSSProperties, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@components/ui/button';
import ThumbDragAndDropZone from './component/thumbs-container';
import { IUploadedImage } from './types';
import ImageUploadApiService from '@desktop/dashboard/main-manage-post/new-post/apis/image-upload-api';

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
  uploadedImages: IUploadedImage[]
}

const ImageUploader: React.FC<IImageUploader> = ({ uploadedImages }) => {
  const [images, setImages] = useState<IUploadedImage[]>(uploadedImages);

  const updateUploadProgress = (file: File, progress: number) => {
    setImages((oldImages: IUploadedImage[]) => {
      return oldImages.map((img: IUploadedImage) => {
        // @ts-ignore: check new attr
        if (img.id == file.new_id) {
          return {
            ...img,
            uploading: true,
            progress: progress
          }
        } else {
          return img;
        }
      });
    });
  }

  const handleUploadCompleted = (result: A) => {
    setImages((oldImages: IUploadedImage[]) => {
      return oldImages.map((img: IUploadedImage) => {
        // @ts-ignore: check new attr
        if (img.uploadedFile && img.uploadedFile.new_id == result.file?.new_id) {
          return {
            ...img,
            uploading: false,
            progress: 100
          }
        } else {
          return img;
        }
      });
    });
  }

  const uploadImagesHandler = (files: File[]) => {
    const uploadPromises = ImageUploadApiService.upload(files, (file, progress) => {
      console.log(`Uploading ${file.name}: ${progress}`)
      updateUploadProgress(file, progress)
    });

    uploadPromises.forEach((uploading) => {
      uploading.then((result) => {
        console.log('Uploaded', result);
        handleUploadCompleted(result);
      })
        .catch((err) => {
          console.error('Error in one or more uploads:', err);
        })
    })

  }
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (files: File[]) => {
      const newImages = files.map((file) => {
        const newId = URL.createObjectURL(file);

        // @ts-ignore: add new attr
        file.new_id = newId;

        const img = {
          id: newId,
          url: URL.createObjectURL(file),
          uploadedFile: file,
          progress: 10
        };
        return img;
      })

      setImages((prev) => [...prev, ...newImages]);
      uploadImagesHandler(files);
    }
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

  useEffect(() => {
    console.log("images", images);

    // form.setValue("image_ids", images.filter(item => item.id ? true : false).map(item => item.id?.toString()).join(","));

    return () => {
      images.forEach((file) => {
        if (file.id) return;
        // URL.revokeObjectURL(file.url)
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const onImagesChanged = (images: IUploadedImage[]) => {
    console.log('onImagesChanged', images)
    setImages(images)
  }

  // Promise.all(uploadPromises)
  //   .then((results) => {
  //     results.forEach((result) => {
  //       setCndImage((prev) => ({
  //         ...prev,
  //         url: result.url,
  //         id: result.id,
  //       }));

  //       // nếu là file vừa mới tải lên
  //       // => view tạm bằng url blob
  //       // => gọi api upload
  //       // => upload thành công thì thay url blob đó bằng url thật
  //       // => giải phóng memory cái ảnh tạm ở phía client
  //       URL.revokeObjectURL(cndImage.url);
  //     });
  //   })
  //   .catch((err) => {
  //     console.error('Error in one or more uploads:', err);
  //     setIsError(true);
  //   })
  //   .finally(() => {
  //     setIsUploading(false);
  //   });


  return (
    <section className="">
      <div
        {...getRootProps({
          className:
            'flex flex-1 flex-col cursor-pointer border-2 rounded-lg border bg-secondary text-muted-foreground',
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

      <ThumbDragAndDropZone uploadedImages={images} onChange={onImagesChanged} />
    </section>
  );
};

export default ImageUploader;
