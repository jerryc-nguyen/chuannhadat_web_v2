import React, { useState } from 'react';
import { authorAtom } from '../states';
import { useAtom } from 'jotai';
import { Button } from '@components/ui/button';

const AuthorInfo: React.FC = () => {
  const [author] = useAtom(authorAtom);
  const [, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(true);
    navigator.clipboard.writeText(author?.phone || '');
    window.location.href = `tel:${author?.phone}`;
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={author?.avatar_url} className="aspect-square h-8 w-8 rounded-full" alt="" />
          <div>
            <p className="font-bold leading-none hover:underline ml-2">{author?.full_name}</p>
          </div>
        </div>
      </div>
      <Button className='rounded-full' onClick={handleClick}>
        Gọi ngay
      </Button>
    </div>
  );
};

export default AuthorInfo;
