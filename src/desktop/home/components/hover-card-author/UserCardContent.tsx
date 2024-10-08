import { services } from '@api/services';
import { CustomerGender } from '@common/types';
import { getInitialsName, truncateText } from '@common/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { LuFacebook, LuMapPin, LuYoutube } from 'react-icons/lu';

type UserCardContentProps = {
  authorSlug: string;
};

const UserCardContent: React.FC<UserCardContentProps> = ({ authorSlug }) => {
  const router = useRouter();
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
          <p className="mt-1 w-fit rounded-sm border px-2 py-1 text-xs font-medium text-slate-600 hover:bg-foreground hover:text-slate-100">
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
            <span className="text-sm text-muted-foreground">Số bài đăng</span>
            <b>{authorData?.posts_count}</b>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-muted-foreground">Giới tính</span>
            <b>{authorData?.gender === CustomerGender.Male ? 'Nam' : 'Nữ'}</b>
          </div>
        </div>
      </div>
      <div className="flex items-center pt-2">
        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
        <span className="text-xs text-muted-foreground">{authorData?.formatted_joined_at}</span>
      </div>
      {authorData?.facebook_url && (
        <div className="flex items-center pt-2">
          <LuFacebook className="mr-2 h-4 w-4 opacity-70" />
          <Link
            href={authorData.facebook_url}
            className="text-xs text-muted-foreground hover:text-black"
          >
            Liên kết facebook
          </Link>
        </div>
      )}
      {authorData?.youtube_url && (
        <div className="flex items-center pt-2">
          <LuYoutube className="mr-2 h-4 w-4 opacity-70" />
          <Link
            href={authorData.youtube_url}
            className="text-xs text-muted-foreground hover:text-black"
          >
            Liên kết youtube
          </Link>
        </div>
      )}
      {authorData?.address && (
        <div className="flex items-center pt-2">
          <LuMapPin className="mr-2 h-4 w-4 opacity-70" />
          <span className="text-xs text-muted-foreground">{authorData?.address}</span>
        </div>
      )}
      <Button
        onClick={() => {
          router.push(`/profile/${authorData?.slug}`);
        }}
        className="mt-4 w-full border bg-blue-500 text-white hover:bg-blue-400"
        variant={'link'}
      >
        Xem trang cá nhân
      </Button>
    </>
  );
  return !authorData ? loadingCardContent() : userCardContent();
};

export default UserCardContent;
