import { Button } from '@components/ui/button';
import { useAtom } from 'jotai';
import Link from 'next/link';
import React, { useState } from 'react';
import { authorAtom } from '../states';

const AuthorInfo: React.FC = () => {
  const [author] = useAtom( authorAtom );
  const [, setIsVisible] = useState( false );

  const handlePhoneClick = () => {
    setIsVisible( true );
    navigator.clipboard.writeText( author?.phone || '' );
    window.location.href = `tel:${author?.phone}`;
  };

  const handleAuthorClick = () => {
    window.location.href = `/profile/${author?.slug}`
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center justify-between" onClick={handleAuthorClick}>
        <div className="flex items-center">
          <img src={`/profile/${author?.slug}`} className="aspect-square h-12 w-12 rounded-full" alt="" />
          <div className='ml-2'>
            <Link href={author?.slug as string} className="font-bold text-lg leading-none">{author?.full_name}</Link>
            <p className='text-sm text-secondary mt-1'>Đã đăng {author?.posts_count} tin</p>
          </div>
        </div>
      </div>
      <Button className='rounded-full' onClick={handlePhoneClick}>
        Gọi ngay
      </Button>
    </div>
  );
};

export default AuthorInfo;
