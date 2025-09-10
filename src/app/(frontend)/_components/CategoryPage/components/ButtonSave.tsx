import React, { useImperativeHandle } from 'react';
import { Button } from '@components/ui/button';
import { AxiosError } from 'axios';
import styles from './CardImageCarousel/CardImageCarousel.module.scss';
import { HeartOutline, HeartFilled } from '@components/icons/CustomIcons';

import { ActionSaveProduct, ISaveProductPayload } from '@models/savesPostModel';
import { listPostIdSavedAtom } from '../states';
import { LoadingThreeQuarters } from '@components/icons/CustomIcons';
import { cn } from '@common/utils';
import { useAtomValue } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { toast } from 'sonner';
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
    const [isSaved, setIsSaved] = React.useState<boolean>(false);
    useImperativeHandle(ref, () => ({
      onSaved: () => {
        setIsLoadingSavePost(true);
        const payload: ISaveProductPayload = {
          product_uid: postUid,
          action: isPostSaved ? ActionSaveProduct.Unlike : ActionSaveProduct.Like,
        };
        savePostMutate(payload);
      },
    }));
    const queryClient = useQueryClient();
    const [isLoadingSavePost, setIsLoadingSavePost] = React.useState<boolean>(false);
    const listPostIdSaved = useAtomValue(listPostIdSavedAtom);

    const isPostSaved = React.useMemo(() => {
      return listPostIdSaved.some((postId) => postId === postUid);
    }, [listPostIdSaved, postUid]);
    React.useEffect(() => {
      setIsSaved(isPostSaved);
    }, [isPostSaved]);
    const { mutate: savePostMutate } = useMutation({
      mutationFn: services.saves.savePost,
      onError: (err: AxiosError<A>) => {
        console.error('Error fetching update', err);
      },
      onSuccess: (data: A) => {
        if (data.status) {
          queryClient.invalidateQueries({ queryKey: ['save_summary'] }).then(() => {
            toast.success(isPostSaved ? 'Bỏ tin đã lưu thành công' : 'Lưu tin đăng thành công');
            setIsSaved((saved) => !saved);
            setIsLoadingSavePost(false);
          });
        } else {
          toast.warning('Lưu tin đăng không thành công');
          setIsLoadingSavePost(false);
        }
      },
    });
    const handleSavePost = () => {
      setIsLoadingSavePost(true);
      const payload: ISaveProductPayload = {
        product_uid: postUid,
        action: isPostSaved ? ActionSaveProduct.Unlike : ActionSaveProduct.Like,
      };
      savePostMutate(payload);
    };

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
