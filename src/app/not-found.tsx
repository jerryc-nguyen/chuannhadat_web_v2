import { cn } from '@common/utils';
import { HttpStatusCode } from 'axios';
import { Marcellus } from 'next/font/google';
import Link from 'next/link';

const readex_pro = Marcellus({
  display: 'auto',
  weight: '400',
  preload: false,
});
type NotFoundProps = {
  errorCode?: HttpStatusCode;
  errorMessage?: string;
  className?: string;
};
export default function NotFound(props: NotFoundProps) {
  const { errorCode = HttpStatusCode.NotFound, errorMessage = 'Page not found', className } = props;
  return (
    <div
      className={cn(
        'flex h-screen w-full flex-col items-center justify-center gap-y-4 overflow-hidden selection:bg-black',
        readex_pro.className,
        className,
      )}
    >
      <h2 className="text-center text-7xl [-webkit-text-fill-color:#fefdf9] [-webkit-text-stroke:1px] md:text-[150px] md:leading-[150px] md:[-webkit-text-stroke:2px]">
        {errorCode}-Something went wrong
      </h2>
      <p className="selection:text-neutral_03 text-xl">Oop, {errorMessage}!</p>
      <Link
        className="hover:text-neutral_03 flex items-center gap-x-4 rounded-full border-2 border-black px-4 py-2 text-xl transition-all hover:bg-black md:text-2xl"
        href="/"
      >
        Back to home
      </Link>
    </div>
  );
}
