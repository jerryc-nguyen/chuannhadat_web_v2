import { useEffect } from 'react';
import Image from 'next/image';
import { CircleX } from 'lucide-react';
import { FileWithPreview } from '../type';

interface IPreviewThumb {
  file: FileWithPreview;
}
const PreviewThumb: React.FC<IPreviewThumb> = ({ file }) => {
  useEffect(() => {
    console.log('dasdads');
  }, []);

  return (
    <div className="group inline-flex h-24 w-24 cursor-grab rounded-lg border-2 border-secondary p-2 transition-transform duration-300 hover:scale-110">
      <div className="relative flex min-w-0 overflow-hidden">
        <Image
          className="block h-full w-auto"
          src={file.preview}
          alt={file.name}
          width={100}
          height={100}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
        <CircleX className="absolute right-0 top-0 z-10 text-[#596570] opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer" />
      </div>
    </div>
  );
};

export default PreviewThumb;
