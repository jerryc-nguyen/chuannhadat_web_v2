import { ReactNode } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

export default function InnerModal({
  title,
  content,
  onClose,
}: {
  title?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  onClose?: IFunction;
}) {
  return (
    <>
      <div className="c-bts__header flex justify-between items-center">
        <div className="c-bts__title">{title}</div>
        <button onClick={onClose} className="c-bts__close">
          <IoCloseOutline size={30} />
        </button>
      </div>
      <div className="c-bts__content">{content}</div>
    </>
  );
}
