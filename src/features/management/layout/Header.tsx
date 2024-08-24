import { twMerge } from 'tailwind-merge';

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps) => {
  return <div className={twMerge('h-15 border-b bg-white', className)}>Header</div>;
};
