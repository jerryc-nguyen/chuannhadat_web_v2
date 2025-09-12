import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Skeleton } from '@components/ui/skeleton';

interface LoadingListPostProps {
  length?: number;
}

const LoadingListPost: React.FC<LoadingListPostProps> = ({ length = 5 }) => {
  return (
    <>
      {new Array(length).fill(0).map((_, index) => (
        <section className="flex gap-x-2 px-5 py-3" key={uuidv4() + index}>
          <Skeleton className="h-[70px] w-[80px]" />
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex h-8 flex-col gap-y-1">
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 flex-1" />
            </div>
            <Skeleton className="mb-1 h-4 w-12" />
          </div>
        </section>
      ))}
    </>
  );
};

export default LoadingListPost;
