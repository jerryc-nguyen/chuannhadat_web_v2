import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';
type LoadingProductCardProps = object;

const LoadingProductCard: React.FC<LoadingProductCardProps> = () => {
  return (
    <Card className="flex-1 p-4">
      <CardHeader className="flex p-0 pb-4">
        <section className="flex items-center gap-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-y-2">
            <Skeleton className="h-4 w-2/4" />
            <div className="mt-1 flex gap-x-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-2/4" />
            </div>
          </div>
          <Skeleton className="h-3 w-8" />
        </section>
      </CardHeader>
      <CardContent className="p-0">
        <Skeleton className="aspect-[16/9] w-full" />
      </CardContent>
      <CardFooter className="flex-col p-0 pt-4">
        <div className="flex w-full flex-col gap-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        <section className="mt-4 flex w-full justify-between">
          <div className="flex w-1/5 flex-col gap-y-1">
            <Skeleton className="h-5" />
            <Skeleton className="h-4" />
          </div>
          <div className="flex w-1/5 flex-col gap-y-1">
            <Skeleton className="h-5" />
            <Skeleton className="h-4" />
          </div>
          <div className="flex w-1/5 flex-col gap-y-1">
            <Skeleton className="h-5" />
            <Skeleton className="h-4" />
          </div>
        </section>
      </CardFooter>
    </Card>
  );
};

export default LoadingProductCard;
