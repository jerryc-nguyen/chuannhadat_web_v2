'use client';
import { useEffect } from 'react';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import Image from 'next/image';
import empty_city from '@assets/images/empty-city.png';

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <section
      className={cn(
        'flex h-screen w-screen flex-col items-center justify-center gap-y-4 selection:bg-black',
      )}
    >
      <Image className="w-full md:w-2/3" src={empty_city} alt="no-notification" />
      <p className="mt-2 w-3/4 text-center text-lg text-foreground">500-Internal server error</p>
      <p className="text-lg selection:text-[#fefdf9]">Oop, Please reload to try again!</p>
      <Button
        onClick={() => window.location.reload()}
        className="flex items-center gap-x-4 rounded-full border-2 border-black bg-transparent px-6 py-2 text-2xl text-black transition-all hover:bg-black hover:text-[#fefdf9]"
      >
        Reload page
      </Button>
    </section>
  );
}
