import { cn } from '@common/utils';
import { Marcellus } from 'next/font/google';
import Link from 'next/link';

const readex_pro = Marcellus({
  display: 'auto',
  weight: '400',
  preload: false,
});
export default function NotFound() {
  return (
    <div
      className={cn(
        'flex h-screen w-screen flex-col items-center justify-center gap-y-4 bg-[#fefdf9] selection:bg-black',
        readex_pro.className,
      )}
    >
      <h2 className="text-center text-[150px] leading-[150px] [-webkit-text-fill-color:#fefdf9] [-webkit-text-stroke:2px]">
        404-Something went wrong
      </h2>
      <p className="selection:text-[#fefdf9]">Oop, Page not found!</p>
      <Link
        className="flex items-center gap-x-4 rounded-full border-2 border-black px-4 py-2 text-2xl transition-all hover:bg-black hover:text-[#fefdf9]"
        href="/"
      >
        Back to home
      </Link>
    </div>
  );
}
