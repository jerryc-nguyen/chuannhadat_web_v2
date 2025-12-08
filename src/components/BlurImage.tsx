import { cn } from '@common/utils';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import React from 'react';

type BlurImageProps = ImageProps & {
  className?: string;
  // When true, disable blur/scale/grayscale transitions to improve LCP
  disableEffects?: boolean;
};

const BlurImage: React.FC<BlurImageProps> = (props) => {
  const [isLoading, setLoading] = React.useState(true);
  const resolvedLoading = props.loading ?? (props.priority ? undefined : 'lazy');
  const resolvedFetchPriority = props.fetchPriority ?? (props.priority ? 'high' : 'low');
  return (
    <Image
      {...props}
      loading={resolvedLoading}
      fetchPriority={resolvedFetchPriority}
      alt={props.alt || 'blur-image'}
      style={{
        width: '100%',
        objectFit: 'cover',
      }}
      className={cn(
        'h-auto w-full object-cover',
        // Only apply visual transitions if effects are enabled
        props.disableEffects ? '' : 'duration-700 ease-in-out',
        props.className,
        props.disableEffects
          ? ''
          : isLoading
            ? 'scale-110 blur-xl grayscale'
            : 'scale-100 blur-0 grayscale-0',
      )}
      onLoad={(e) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (props.onLoad as any)?.(e);
        } finally {
          setLoading(false);
        }
      }}
    />
  );
};

export default BlurImage;
