'use client';
import { services } from '@api/services';
import { cn, timeAgo } from '@common/utils';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { Separator } from '@components/ui/separator';
import { Skeleton } from '@components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LucideHeart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import EmptyPost from '@assets/images/empty-state_wap_v1.svg';
import { useSetAtom } from 'jotai';
import { listPostIdSavedAtom } from '@views/home/states';
import { AxiosError } from 'axios';
import {
  ActionSaveProduct,
  ISaveProductPayload,
  ISavedProductsResponse,
} from '@models/savesPostModel';
import { LoadingThreeQuarters } from '@components/icons/CustomIcons';
import { toast } from 'sonner';
import { useAuth } from '@common/auth/AuthContext';
import { useSearchParams } from 'next/navigation';
import { useViewedPosts } from '@hooks/useViewedPosts';
import OptionsTabList from '@mobile/ui/OptionsTabList';
import { OptionForSelect } from '@models';
import { IViewedProductDetail } from '@mobile/searchs/type';
import { useIsMobile } from '@hooks';

type FavoriteIconProps = object;

// TODO: move to constants
export const viewOptions = [
  { text: 'Tin đã lưu', value: 'saved' },
  { text: 'Tin đã xem', value: 'viewed' },
];

const LoadingListPost = ({ length = 5 }: { length?: number }) => {
  return (
    <>
      {new Array(length).fill(0).map((_, index) => (
        <section className="flex gap-x-2 px-5 py-3" key={uuidv4() + index}>
          <Skeleton className="h-[70px] w-[80px]" />
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex h-8 flex-col gap-y-1">
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 flex-1" />
            </div>
            <Skeleton className="mb-1 h-4 w-12" />
          </div>
        </section>
      ))}
    </>
  );
};

// Saved Posts List component
type ActivityPostsListProps = {
  data: ISavedProductsResponse['data'] | IViewedProductDetail[];
  pagination?: ISavedProductsResponse['pagination'];
  loadingRemovePostId: string;
  handleRemovePost: (uid: string) => Promise<void>;
};

const ActivityPostsList: React.FC<ActivityPostsListProps> = ({
  data,
  loadingRemovePostId,
  handleRemovePost,
  pagination,
}) => {
  if (pagination?.total_count === 0)
    return (
      <div className="mb-4 flex items-center justify-center pb-4 pt-2">
        <Image alt="empty-save-post" src={EmptyPost} />
      </div>
    );

  return data.map((post) => {
    const formatted_price = post?.product?.formatted_price;
    const formatted_area = post?.product?.formatted_area;
    const formatted_kt = post?.product?.formatted_kt;

    const isLoadingDelete = loadingRemovePostId === post?.product?.uid;

    return (
      <section
        key={post?.id}
        className="flex items-center gap-x-1 px-0 py-3 text-left hover:bg-slate-100 lg:px-5"
      >
        <Link href={post?.product?.detail_path} className="flex flex-1 cursor-pointer gap-x-2">
          <Image
            width={80}
            height={70}
            className="h-[70px] overflow-hidden rounded-sm border bg-slate-200 object-cover shadow-md"
            alt={post?.product?.title}
            src={post?.product?.images[0].url}
            unoptimized
          />

          <div className="flex flex-1 flex-col justify-between">
            <p className="line-clamp-2 text-xs font-semibold hover:text-primary_color">
              {post?.product?.title}
            </p>
            <div className="flex gap-2 text-xs font-light text-secondary">
              <span className="rounded-sm border px-1 font-medium">{formatted_price || '--'}</span>
              <span className="rounded-sm border px-1 font-medium">{formatted_area || '--'}</span>
              <span className="rounded-sm border px-1 font-medium">{formatted_kt || '--'}</span>
            </div>
            <span className="mt-1 text-xs font-light text-secondary">
              {timeAgo(post?.created_at)}
            </span>
          </div>
        </Link>
        {isLoadingDelete ? (
          <LoadingThreeQuarters className="animate-spin text-xl duration-500" />
        ) : (
          <X
            onClick={() => handleRemovePost(post?.product?.uid)}
            className="cursor-pointer text-xl hover:text-error_color"
          />
        )}
      </section>
    );
  });
};

const FavoriteIcon: React.FC<FavoriteIconProps> = () => {
  const [openSavedPost, setOpenSavePost] = React.useState<boolean>(false);
  const { currentUser } = useAuth();
  const [isShowBadge, setIsShowBadge] = React.useState<boolean>(true);
  const setListPostIdSaved = useSetAtom(listPostIdSavedAtom);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const hideDangtinButton = searchParams?.get('hide_create_post') == 'true';
  const [selectedTab, setSelectedTab] = useState<OptionForSelect | undefined>(viewOptions[0]);
  const isMobile = useIsMobile();
  const [loadingDeleteUid, setLoadingDeleteUid] = useState('');

  const { data: savedSummary, isSuccess } = useQuery({
    queryKey: ['save_summary', currentUser?.api_token],
    queryFn: () => services.saves.savedSummary(),
    select: (data) => data.data,
  });

  const { data: listSavedPost, isFetching } = useQuery({
    queryKey: ['list_saves_post'],
    queryFn: () => services.saves.savedPosts(),
    enabled: openSavedPost,
    staleTime: 0,
  });

  const {
    listProduct: listViewed,
    pagination: paginationViewed,
    isFetching: isViewedFetching,
    deleteViewedPost,
  } = useViewedPosts({
    productUid: '',
    defaultPageSize: 20,
    enabled: openSavedPost && selectedTab?.value === 'viewed',
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
    if (savedSummary) {
      setListPostIdSaved(savedSummary.saved_product_uids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSummary?.saved_product_uids]);

  const { mutate: savePostMutate } = useMutation({
    mutationFn: services.saves.savePost,
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching update', err);
    },
    onSuccess: (data: A) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ['save_summary'] });
        queryClient.invalidateQueries({ queryKey: ['list_saves_post'] }).then(() => {
          toast.success('Xóa tin lưu thành công');
        });
      } else {
        toast.error('Xóa tin lưu không thành công');
      }
    },
    onSettled: () => {
      setLoadingDeleteUid('');
    },
  });

  const handleRemovePost = async (uid: string) => {
    setLoadingDeleteUid(uid);
    const payload: ISaveProductPayload = {
      product_uid: uid,
      action: ActionSaveProduct.Unlike,
    };
    savePostMutate(payload);
  };

  const handleRemoveViewedPost = async (uid: string) => {
    setLoadingDeleteUid(uid);
    await deleteViewedPost(uid);
    setLoadingDeleteUid('');
  };

  const renderBadge = () => (
    <Badge
      className={cn(
        'absolute -right-2 top-0 ml-auto flex aspect-square shrink-0 items-center justify-center rounded-full border border-white p-0',
        isMobile ? 'h-6 w-6 -translate-y-1/2' : 'h-5 w-5 -translate-y-[7px] text-[10px]',
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
  );

  const RenderContent = () => (
    <>
      <div className="px-0 py-2 text-center text-lg font-semibold lg:px-5">
        <OptionsTabList
          options={viewOptions}
          value={selectedTab}
          onChange={(selected) => setSelectedTab(selected)}
        />
      </div>
      <Separator />
      <section
        className={isMobile ? 'max-h-[90vh] scrollbar-hide' : 'max-h-[50vh] scrollbar-hide'}
        style={{ overflowY: 'auto' }}
      >
        {selectedTab?.value === 'saved' ? (
          isFetching ? (
            <LoadingListPost length={savedSummary?.saved_product_uids.length} />
          ) : (
            <ActivityPostsList
              data={listSavedPost?.data ?? []}
              pagination={listSavedPost?.pagination}
              loadingRemovePostId={loadingDeleteUid}
              handleRemovePost={handleRemovePost}
            />
          )
        ) : (
          <>
            {isViewedFetching ? (
              <LoadingListPost length={10} />
            ) : (
              <ActivityPostsList
                data={listViewed}
                pagination={paginationViewed}
                loadingRemovePostId={loadingDeleteUid}
                handleRemovePost={handleRemoveViewedPost}
              />
            )}
          </>
        )}
      </section>
    </>
  );

  // Render different components based on device
  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenSavePost} open={openSavedPost}>
        <SheetTrigger asChild>
          <div className="relative">
            <Button size={'icon'} variant="outline" className="rounded-full">
              <LucideHeart className="h-5 w-5" />
            </Button>
            {isShowBadge && renderBadge()}
          </div>
        </SheetTrigger>
        <SheetContent className="w-[90vw] p-0">
          <SheetHeader className="p-3">
            <SheetTitle className="pt-6">
              <RenderContent />
            </SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover onOpenChange={setOpenSavePost} open={openSavedPost}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button size={'icon'} variant="outline" className="rounded-full">
            <LucideHeart className="h-5 w-5" />
          </Button>
          {isShowBadge && renderBadge()}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-[23rem] p-0', {
          'left-1/2 -translate-x-1/2': !hideDangtinButton,
        })}
        side="bottom"
        align="center"
      >
        <RenderContent />
      </PopoverContent>
    </Popover>
  );
};

export default FavoriteIcon;
