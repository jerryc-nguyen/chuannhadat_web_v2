import { Button } from '@components/ui/button';
import Link from 'next/link';
import React, { useState } from 'react';
import { DEFAULT_AVATAR } from '@common/constants';
import type { Author } from '@common/types';

type Props = { author?: Author };

const AuthorInfo: React.FC<Props> = ({ author }) => {
  const [, setIsVisible] = useState(false);

  const handlePhoneClick = () => {
    setIsVisible(true);
    navigator.clipboard.writeText(author?.phone || '');
    window.location.href = `tel:${author?.phone}`;
  };

  const handleAuthorClick = () => {
    window.location.href = `/profile/${author?.slug}`
  }
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center justify-between" onClick={handleAuthorClick}>
        <Link href={`/profile/${author?.slug || ''}`} className='flex items-center'>
          <img src={author?.avatar_url || DEFAULT_AVATAR} className="aspect-square h-12 w-12 rounded-full" alt="" />
          <div className='ml-2'>
            <span className="font-bold text-lg leading-none">{author?.full_name}</span>
            <p className='text-sm text-secondary mt-1'>Đã đăng {author?.posts_count} tin</p>
          </div>
        </Link>
      </div>
      <Button className='rounded-full' onClick={handlePhoneClick}>
        Gọi ngay
      </Button>
    </div>
  );
};

export default AuthorInfo;
