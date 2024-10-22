import React from 'react';
import { Button } from '@components/ui/button';
import { AxiosError } from 'axios';
import { PiHeart, PiHeartFill } from 'react-icons/pi';
import { ActionSaveProduct, ISaveProductPayload } from '@models/savesPostModel';
import { listPostIdSavedAtom } from '../states';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@common/utils';
import { useAtomValue } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { toast } from 'sonner';

type ButtonSaveProps = {
  postUid: string;
};

const ButtonSave: React.FC<ButtonSaveProps> = ({ postUid }) => {
  const [isSaved, setIsSaved] = React.useState<boolean>(false);
  const queryClient = useQueryClient();
  const [isLoadingSavePost, setIsLoadingSavePost] = React.useState<boolean>(false);
  const listPostIdSaved = useAtomValue(listPostIdSavedAtom);

  const isPostSaved = React.useMemo(() => {
    return listPostIdSaved.some((postId) => postId === postUid);
  }, [listPostIdSaved]);
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
          toast.success('Lưu tin đăng thành công');
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
      disabled={isLoadingSavePost}
      variant="outline"
      className={cn(
        'favorite_button opacity-1 absolute right-3 top-3 z-[3] rounded-full transition-all',
        !isLoadingSavePost && isSaved
          ? '!visible border-none bg-red-100 !opacity-100 hover:bg-red-100'
          : '',
      )}
    >
      <div className={cn('favorite-icon', isSaved ? 'heart-animate' : '')}>
        {isLoadingSavePost && (
          <AiOutlineLoading3Quarters
            className={cn('animate-spin duration-500', isSaved ? 'text-error_color' : '')}
          />
        )}
        {!isLoadingSavePost && !isSaved && <PiHeart className="h-4 w-4" />}
        {!isLoadingSavePost && isSaved && (
          <PiHeartFill className={'test_animate h-4 w-4 scale-100 text-error_color'} />
        )}
      </div>
    </Button>
  );
};

export default ButtonSave;
