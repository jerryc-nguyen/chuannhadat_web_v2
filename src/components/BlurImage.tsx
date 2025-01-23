import { cn } from '@common/utils';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import React from 'react';

type BlurImageProps = ImageProps & {
  className?: string;
};

const BlurImage: React.FC<BlurImageProps> = (props) => {
  const [isLoading, setLoading] = React.useState(true);
  return (
    <Image
      {...props}
      alt={props.alt || 'blur-image'}
      style={{
        width: '100%',
        objectFit: 'cover',
      }}
      className={cn(
        'h-auto w-full object-cover duration-700 ease-in-out',
        props.className,
        isLoading ? 'scale-110 blur-xl grayscale' : 'scale-100 blur-0 grayscale-0',
      )}
      onLoad={() => setLoading(false)}
    />
  );
};

export default BlurImage;
