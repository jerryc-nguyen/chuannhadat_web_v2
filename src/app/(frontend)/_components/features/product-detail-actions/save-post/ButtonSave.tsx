import React, { useImperativeHandle } from 'react';
import { Button } from '@components/ui/button';
import styles from '@frontend/CategoryPage/components/ThumbsCarousel/CardImageCarousel.module.scss';
import { HeartOutline, HeartFilled, LoadingThreeQuarters } from '@components/icons/CustomIcons';
import { cn } from '@common/utils';
import { useButtonSave } from './hooks/useButtonSave';

type ButtonSaveProps = {
  postUid: string;
  className?: string;
  disabled?: boolean;
};

export type ButtonSaveHandle = {
  onSaved: () => void;
};

const ButtonSave = React.forwardRef<ButtonSaveHandle, ButtonSaveProps>(
  ({ postUid, className, disabled }, ref) => {
    const { isSaved, isLoadingSavePost, handleSavePost, onSaved } = useButtonSave({ postUid });

    useImperativeHandle(ref, () => ({
      onSaved,
    }));

    return (
      <Button
        onClick={handleSavePost}
        size={'icon'}
        disabled={isLoadingSavePost || disabled}
        variant="outline"
        className={cn(
          'opacity-1 invisible absolute right-3 top-3 z-[3] rounded-full opacity-0 transition-all',
          styles['favorite_button'],
          !isLoadingSavePost &&
          isSaved &&
          '!visible border-none bg-red-100 !opacity-100 hover:bg-red-100',
          className,
        )}
      >
        <div className={cn('favorite-icon', isSaved ? 'heart-animate' : '')}>
          {isLoadingSavePost && (
            <LoadingThreeQuarters
              className={cn('animate-spin duration-500', isSaved ? 'text-error_color' : '')}
            />
          )}
          {!isLoadingSavePost && !isSaved && <HeartOutline className="h-4 w-4" />}
          {!isLoadingSavePost && isSaved && (
            <HeartFilled className={'test_animate h-4 w-4 scale-100 text-error_color'} />
          )}
        </div>
      </Button>
    );
  },
);

ButtonSave.displayName = 'ButtonSave';
export default ButtonSave;
