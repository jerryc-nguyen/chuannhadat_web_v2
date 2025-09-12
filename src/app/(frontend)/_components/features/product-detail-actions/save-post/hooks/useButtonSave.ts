import React from 'react';
import { AxiosError } from 'axios';
import { useAtomValue } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ActionSaveProduct, ISaveProductPayload } from '@app/(frontend)/_components/features/product-detail-actions/save-post/types';
import { listPostIdSavedAtom } from '@app/(frontend)/_components/CategoryPage/states';
import { savesApi } from '@app/(frontend)/_components/CategoryPage/api/saves';

export interface UseButtonSaveProps {
  postUid: string;
}

export interface UseButtonSaveReturn {
  isSaved: boolean;
  isLoadingSavePost: boolean;
  isPostSaved: boolean;
  handleSavePost: () => void;
  onSaved: () => void;
}

export const useButtonSave = ({ postUid }: UseButtonSaveProps): UseButtonSaveReturn => {
  const [isSaved, setIsSaved] = React.useState<boolean>(false);
  const [isLoadingSavePost, setIsLoadingSavePost] = React.useState<boolean>(false);
  const queryClient = useQueryClient();
  const listPostIdSaved = useAtomValue(listPostIdSavedAtom);

  const isPostSaved = React.useMemo(() => {
    return listPostIdSaved.some((postId) => postId === postUid);
  }, [listPostIdSaved, postUid]);

  React.useEffect(() => {
    setIsSaved(isPostSaved);
  }, [isPostSaved]);

  const { mutate: savePostMutate } = useMutation({
    mutationFn: savesApi.savePost,
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

  const onSaved = () => {
    setIsLoadingSavePost(true);
    const payload: ISaveProductPayload = {
      product_uid: postUid,
      action: isPostSaved ? ActionSaveProduct.Unlike : ActionSaveProduct.Like,
    };
    savePostMutate(payload);
  };

  return {
    isSaved,
    isLoadingSavePost,
    isPostSaved,
    handleSavePost,
    onSaved,
  };
};
