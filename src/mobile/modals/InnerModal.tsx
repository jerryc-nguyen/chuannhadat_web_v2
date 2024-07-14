import { Button } from 'konsta/react';
import { ReactNode } from 'react';
import { IoChevronBackCircleOutline } from 'react-icons/io5';

export default function InnerModal({
  title,
  content,
  footer,
  onClose,
}: {
  title?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className='_8eLsd _KVwkC'>
      <div className='_7vsRM _-rIgv rss-header'>
        <div className='flex items-center'>
          <span style={{ marginRight: '5px' }}>
            <IoChevronBackCircleOutline onClick={onClose} />
          </span>

          <div>{title}</div>
        </div>
      </div>
      <div className='_QLjfS rss-content'>
        <div className='_2Ejye'>
          <div style={{ paddingTop: 45 + 'px' }}>{content}</div>
        </div>
      </div>
      <div className='_xlcmb hidden'>{footer}</div>
    </div>
  );
}
