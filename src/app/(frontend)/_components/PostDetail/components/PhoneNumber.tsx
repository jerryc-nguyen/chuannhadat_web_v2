import React, { useState } from 'react';
import { authorAtom } from '@frontend/PostDetail/mobile/post-detail/states';
import { useAtom } from 'jotai';

const PhoneNumber: React.FC = () => {
  const [author] = useAtom(authorAtom);
  const authorPhone = author?.phone || ''
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(true);
    navigator.clipboard.writeText(authorPhone || '');
    window.location.href = `tel:${authorPhone || ''}`;
  };

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer text-xl text-blue-600 hover:underline"
    >
      Liên hệ: {isVisible ? authorPhone : `${authorPhone.slice(0, -6)}xxxxxx`}
    </span>
  );
};

export default PhoneNumber;
