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
        'flex h-screen w-screen flex-col items-center justify-center gap-y-4 bg-[#fefdf9] selection:bg-black',
      )}
    >
      <h2 className="text-center text-[100px] leading-[100px] [-webkit-text-fill-color:#fefdf9] [-webkit-text-stroke:2px] md:text-[140px] md:leading-[150px]">
        500-Internal server error
      </h2>
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
