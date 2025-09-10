import { services } from '@api/services';
import { getInitialsName, truncateText } from '@common/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Facebook, MapPin, Youtube } from 'lucide-react';

type UserCardContentProps = {
  authorSlug: string;
};

const UserCardContent: React.FC<UserCardContentProps> = ({ authorSlug }) => {
  const { data: authorData, status } = useQuery({
    queryKey: ['get-author-by-slug', authorSlug],
    queryFn: () => services.profiles.getProfileSlug(authorSlug),
    enabled: !!authorSlug,
    select: (data) => data.data,
  });
  const loadingCardContent = () => {
    return status === 'error' ? (
      <p className="text-center">Dữ liệu không tìm thấy, vui lòng thử lại sau!</p>
    ) : (
      <>
        <div className="flex items-center gap-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="mt-1 h-6 w-[90px]" />
          </div>
        </div>
        <div>
          <Skeleton className="mb-2 mt-3 h-5 w-2/3" />
          <div className="flex gap-x-4">
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-6 w-5" />
            </div>
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-6 w-5" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-2 pt-2">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
        <div className="flex items-center gap-x-3 pt-2">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
        <div className="flex items-center gap-x-3 pt-2">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
        <Skeleton className="mt-4 h-10 w-full" />
      </>
    );
  };
  const userCardContent = () => (
    <>
      <div className="flex items-center gap-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={authorData?.avatar_url} />
          <AvatarFallback>{getInitialsName(authorData?.full_name as string)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-base font-semibold">{authorData?.full_name}</h4>
          <p className="mt-1 w-fit rounded-sm border px-2 py-1 text-xs font-medium text-secondary hover:bg-foreground hover:text-slate-100">
            {authorData?.profile_tags[0]}
          </p>
        </div>
      </div>
      <div>
        <p className="mb-2 mt-3 text-sm">
          {truncateText((authorData?.description || authorData?.job_title) as string)}
        </p>
        <div className="flex gap-x-4">
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-secondary">Số bài đăng</span>
            <b>{authorData?.posts_count}</b>
          </div>
        </div>
      </div>
      <div className="flex items-center pt-2">
        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
        <span className="text-xs text-secondary">{authorData?.formatted_joined_at}</span>
      </div>
      {authorData?.facebook_url && (
        <div className="flex items-center pt-2">
          <Facebook className="mr-2 h-4 w-4 opacity-70" />
          <Link
            href={authorData.facebook_url}
            className="text-xs text-secondary hover:text-black"
          >
            Liên kết facebook
          </Link>
        </div>
      )}
      {authorData?.youtube_url && (
        <div className="flex items-center pt-2">
          <Youtube className="mr-2 h-4 w-4 opacity-70" />
          <Link
            href={authorData.youtube_url}
            className="text-xs text-secondary hover:text-black"
          >
            Liên kết youtube
          </Link>
        </div>
      )}
      {authorData?.address && (
        <div className="flex items-center pt-2">
          <MapPin className="mr-2 h-4 w-4 opacity-70" />
          <span className="text-xs text-secondary">{authorData?.address}</span>
        </div>
      )}
      <Link href={`/profile/${authorData?.slug}`} target="_blank">
        <Button
          className="mt-4 w-full border bg-primary_color/80 text-white hover:bg-primary_color"
          variant={'link'}
        >
          Xem trang cá nhân
        </Button>
      </Link>
    </>
  );
  return !authorData ? loadingCardContent() : userCardContent();
};

export default UserCardContent;
