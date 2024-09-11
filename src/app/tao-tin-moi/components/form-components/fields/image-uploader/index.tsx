import React, { useEffect, useState, CSSProperties, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@components/ui/button';
import ThumbDragAndDropZone from './component/thumbs-container';
import { FileWithPreview } from '@app/tao-tin-moi/type';
import ImageUploadApiService from '@app/tao-tin-moi/apis/image-upload-api';

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

const ImageUploader: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => {
            const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
            ImageUploadApiService.upload([fileWithPreview]);
            return fileWithPreview;
        }
        ),
      ]);
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

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

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

      <ThumbDragAndDropZone files={files} setFiles={setFiles}/>
    </section>
  );
};

export default ImageUploader;
