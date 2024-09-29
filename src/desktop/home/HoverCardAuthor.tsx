import { services } from '@api/services';
import { CustomerGender } from '@common/types';
import { getInitialsName, truncateText } from '@common/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { CardContent } from '@components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@components/ui/hover-card';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { LuFacebook, LuMapPin, LuYoutube } from 'react-icons/lu';

type HoverCardAuthorProps = {
  authorSlug: string;
  children: React.ReactNode;
};

const UserCardContent = ({ authorData }: { authorData: A }) => {
  const router = useRouter();

  return <>
    <div className="flex items-center gap-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={authorData.avatar_url} />
        <AvatarFallback>{getInitialsName(authorData.full_name)}</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="text-base font-semibold">{authorData.full_name}</h4>
        <p className="mt-1 w-fit rounded-sm border px-2 py-1 text-xs font-medium text-slate-600 hover:bg-foreground hover:text-slate-100">
          {authorData.profile_tags[0]}
        </p>
      </div>
    </div>
    <div>
      <p className="mb-2 mt-3 text-sm">{truncateText(authorData.description || authorData.job_title)}</p>
      <div className="flex gap-x-4">
        <div className="flex items-center gap-x-2">
          <span className="text-sm text-muted-foreground">Số bài đăng</span>
          <b>{authorData.posts_count}</b>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="text-sm text-muted-foreground">Giới tính</span>
          <b>{authorData.gender === CustomerGender.Male ? 'Nam' : 'Nữ'}</b>
        </div>
      </div>
    </div>
    <div className="flex items-center pt-2">
      <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
      <span className="text-xs text-muted-foreground">{authorData.formatted_joined_at}</span>
    </div>
    {authorData.facebook_url && (
      <div className="flex items-center pt-2">
        <LuFacebook className="mr-2 h-4 w-4 opacity-70" />
        <Link href={authorData.facebook_url} className="text-xs text-muted-foreground hover:text-black">
          Liên kết facebook
        </Link>
      </div>
    )}
    {authorData.youtube_url && (
      <div className="flex items-center pt-2">
        <LuYoutube className="mr-2 h-4 w-4 opacity-70" />
        <Link href={authorData.youtube_url} className="text-xs text-muted-foreground hover:text-black">
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
        router.push(`profile/${authorData.id}`);
      }}
      className="mt-4 w-full border hover:bg-foreground hover:text-white"
      variant={'link'}
    >
      Xem trang cá nhân
    </Button>
  </>
}

const HoverCardAuthor: React.FC<HoverCardAuthorProps> = ({ authorSlug, children }) => {
  const { data: authorData } = useSuspenseQuery({
    queryKey: ['get-author-by-slug', authorSlug],
    queryFn: () => services.profiles.getProfileSlug(authorSlug),
    select: (data) => data.data,
  });


  return (
    <HoverCard openDelay={200} closeDelay={100} defaultOpen={false}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent onClick={(e) => e.stopPropagation()} className="min-w-[22rem] hover:cursor-default">
        {authorData && <UserCardContent authorData={authorData}></UserCardContent>}
        {!authorData && 'Loading...'}
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardAuthor;
