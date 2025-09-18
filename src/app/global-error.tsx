'use client';
import { useEffect } from 'react';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import Image from 'next/image';
import empty_city from '@assets/images/empty-city.png';

// Define a proper type for the error object
interface ErrorWithDigest extends Error {
  digest?: string;
  name: string;
  message: string;
  stack?: string;
}

export default function GlobalError({ error, reset }: { error: ErrorWithDigest; reset: () => void }) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Global application error:', error);
  }, [error]);

  return (
    <section
      className={cn(
        'flex h-screen w-screen flex-col items-center justify-center gap-y-4 selection:bg-black',
      )}
    >
      <Image className="w-full md:w-2/3" src={empty_city} alt="no-notification" />
      <p className="mt-2 w-3/4 text-center text-lg text-foreground">500-Internal server error</p>
      <p className="text-lg selection:text-[#fefdf9]">Oops, an unexpected error has occurred. Please try again.</p>
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-lg overflow-auto p-4 bg-red-50 text-red-900 rounded border border-red-300 my-4">
          <p className="font-bold">Error details (only visible in development):</p>
          <p>{error.message || 'Unknown error'}</p>
          <p className="text-sm mt-2">{error.digest && `Error ID: ${error.digest}`}</p>
        </div>
      )}
      <div className="flex gap-4">
        <Button
          onClick={() => window.location.reload()}
          className="flex items-center gap-x-4 rounded-full border-2 border-black bg-transparent px-6 py-2 text-2xl text-black transition-all hover:bg-black hover:text-[#fefdf9]"
        >
          Reload page
        </Button>
        <Button
          onClick={() => reset()}
          className="flex items-center gap-x-4 rounded-full border-2 border-black bg-black px-6 py-2 text-2xl text-[#fefdf9] transition-all hover:bg-transparent hover:text-black"
        >
          Try again
        </Button>
      </div>
    </section>
  );
}
