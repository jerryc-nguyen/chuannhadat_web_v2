'use client';
import { services } from '@api/services';
import { cn, timeAgo } from '@common/utils';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { Separator } from '@components/ui/separator';
import { Skeleton } from '@components/ui/skeleton';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LucideHeart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import EmptyPost from '@assets/images/empty-state_wap_v1.svg';
import { useSetAtom } from 'jotai';
import { listPostIdSavedAtom } from '@views/home/states';
import { AxiosError } from 'axios';
import { ActionSaveProduct, ISaveProductPayload } from '@models/savesPostModel';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'sonner';
import { useAuth } from '@common/auth/AuthContext';
import { useSearchParams } from 'next/navigation';

type FavoriteIconProps = object;
type PostLoadingType = {
  id: string;
  status: boolean;
};
const FavoriteIcon: React.FC<FavoriteIconProps> = () => {
  const [openSavedPost, setOpenSavePost] = React.useState<boolean>(false);
  const { currentUser } = useAuth();
  const [isShowBadge, setIsShowBadge] = React.useState<boolean>(true);
  const [loadingRemovePost, setLoadingRemovePost] = React.useState<PostLoadingType[]>([]);
  const setListPostIdSaved = useSetAtom(listPostIdSavedAtom);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const hideDangtinButton = searchParams.get('hide_create_post') == 'true';

  const { data: savedSummary, isSuccess } = useQuery({
    queryKey: ['save_summary', currentUser?.api_token],
    queryFn: () => services.saves.savedSummary(),
    select: (data) => data.data,
  });
  React.useEffect(() => {
    if (isSuccess) {
      if (savedSummary && savedSummary.saved_product_uids.length === 0) {
        setIsShowBadge(false);
      } else {
        setIsShowBadge(true);
      }
    }
  }, [isSuccess, savedSummary]);
  React.useEffect(() => {
    const listPostLoading = savedSummary?.saved_product_uids.map((item) => ({
      id: item,
      status: false,
    }));
    setLoadingRemovePost(listPostLoading as PostLoadingType[]);
  }, [savedSummary?.saved_product_uids]);

  React.useEffect(() => {
    if (savedSummary) {
      setListPostIdSaved(savedSummary.saved_product_uids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSummary?.saved_product_uids]);

  const { data: listSavedPost, isFetching } = useQuery({
    queryKey: ['list_saves_post'],
    queryFn: services.saves.savedPosts,
    enabled: openSavedPost,
    staleTime: 0,
  });

  const { mutate: RemoveSavedPostMutate } = useMutation({
    mutationFn: services.saves.savePost,
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching update', err);
    },
    onSuccess: (data: A) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ['save_summary'] });
        queryClient.invalidateQueries({ queryKey: ['list_saves_post'] }).then(() => {
          setLoadingRemovePost((post) => post.filter((item) => !item.status));
          toast.success('Xóa tin lưu thành công');
        });
      } else {
        toast.error('Xóa tin lưu không thành công');
      }
    },
  });

  const handleRemovePost = (uid: string) => {
    setLoadingRemovePost((post) =>
      post.map((item) => {
        if (item.id === uid)
          return {
            id: uid,
            status: true,
          };
        return item;
      }),
    );
    const payload: ISaveProductPayload = {
      product_uid: uid,
      action: ActionSaveProduct.Unlike,
    };
    RemoveSavedPostMutate(payload);
  };

  const onRenderLoadingListPost = () =>
    new Array(savedSummary?.saved_product_uids.length).fill(0).map((item) => (
      <section className="flex gap-x-2 px-5 py-3" key={uuidv4() + item}>
        <Skeleton className="h-[70px] w-[80px]" />
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex h-8 flex-col gap-y-1">
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
          </div>
          <Skeleton className="mb-1 h-4 w-12" />
        </div>
      </section>
    ));
  const onRenderListPost = () => {
    if (listSavedPost?.pagination?.total_count === 0)
      return (
        <div className="mb-4 flex items-center justify-center pb-4 pt-2">
          <Image alt="empty-save-post" src={EmptyPost} />
        </div>
      );
    return listSavedPost?.data.map((post) => (
      <section key={post.id} className="flex items-center gap-x-1 px-5 py-3 hover:bg-slate-100">
        <Link href={post.product?.detail_path} className="flex flex-1 cursor-pointer gap-x-2">
          <Image
            width={80}
            height={70}
            className="h-[70px] overflow-hidden rounded-sm border bg-slate-200 object-cover shadow-md"
            alt={post.product.title}
            src={post.product.images[0].url}
            unoptimized
          />

          <div className="flex flex-1 flex-col justify-between">
            <p className="line-clamp-2 text-xs font-semibold hover:text-primary_color">
              {post.product.title}
            </p>
            <span className="mb-1 text-xs text-secondary">{timeAgo(post.created_at)}</span>
          </div>
        </Link>
        {loadingRemovePost.find((item) => item.id === post.product.uid)?.status ? (
          <AiOutlineLoading3Quarters className="animate-spin text-xl duration-500" />
        ) : (
          <HiMiniXMark
            onClick={() => handleRemovePost(post.product.uid)}
            className="cursor-pointer text-xl hover:text-error_color"
          />
        )}
      </section>
    ));
  };

  return (
    <Popover onOpenChange={setOpenSavePost} open={openSavedPost}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button size={'icon'} variant="outline" className="rounded-full">
            <LucideHeart className="h-5 w-5" />
          </Button>
          {isShowBadge && (
            <Badge
              className={cn(
                'absolute -right-2 top-0 ml-auto flex aspect-square h-5 w-5 shrink-0 -translate-y-[7px] items-center justify-center rounded-full border border-white p-0 text-[10px]',
                savedSummary
                  ? 'bg-error_color hover:bg-error_color'
                  : 'bg-transparent hover:bg-transparent',
              )}
            >
              {savedSummary ? (
                savedSummary.saved_product_uids.length
              ) : (
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary_color opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-primary_color" />
                </span>
              )}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-[23rem] p-0', {
          'left-1/2 -translate-x-1/2': !hideDangtinButton,
        })}
        side="bottom"
        align="center"
      >
        <h4 className="py-2 text-center text-lg font-semibold">Tin đăng đã lưu</h4>
        <Separator />
        <section className="max-h-[50vh] overflow-y-auto">
          {isFetching ? onRenderLoadingListPost() : onRenderListPost()}
        </section>
      </PopoverContent>
    </Popover>
  );
};

export default FavoriteIcon;
