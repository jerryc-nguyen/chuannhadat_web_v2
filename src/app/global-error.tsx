'use client';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Marcellus } from 'next/font/google';

// Error boundaries must be Client Components
const readex_pro = Marcellus({
  display: 'auto',
  weight: '400',
  preload: false,
});
export default function GlobalError() {
  return (
    <section
      className={cn(
        readex_pro.className,
        'flex h-screen w-screen flex-col items-center justify-center gap-y-4 selection:bg-black',
      )}
    >
      <h2 className="text-center text-[150px] leading-[150px] [-webkit-text-fill-color:#fefdf9] [-webkit-text-stroke:2px]">
        500-Internal server error
      </h2>
      <p className="selection:text-neutral_03 text-xl">Oop, Please reload to try again!</p>
      <Button
        onClick={() => window.location.reload()}
        className="hover:text-neutral_03 flex items-center gap-x-4 rounded-full border-2 border-black bg-transparent px-6 py-2 text-2xl text-black transition-all hover:bg-black"
      >
        Reload page
      </Button>
    </section>
  );
}
