import { services } from '@api/services';
import { cn, genKey, getInitialsName } from '@common/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { LuPhoneIncoming } from 'react-icons/lu';
import { AuthorPostProps } from '../type';
import DialogContactAgain from '@components/dialog-contact-again';
import PostsBySameAuthor from './posts-by-same-author';
import ButtonPhone from '@components/button-phone';
import { useRouter } from 'next/navigation';

const AuthorPost: React.FC<AuthorPostProps> = ({ data, className }) => {
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['get-profile', data?.author?.slug],
    queryFn: () => services.profiles.getProfileSlug(data?.author?.slug),
    enabled: !!data?.author?.slug,
    select: (data) => data.data,
  });
  const router = useRouter();
  const loadingAuthor = () => {
    return (
      <div className="author-post h-fit flex-1 rounded-md border bg-white p-6">
        <Skeleton className="h-[28px] w-40" />
        <div className="my-6 flex items-center gap-x-3 space-x-4">
          <Skeleton className="h-[100px] w-[100px] rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-18 h-5" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
        <div className="my-8 flex flex-col gap-y-2">
          {new Array(4).fill(0).map((_item, index) => (
            <Skeleton key={genKey(index)} className="h-5 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-y-2">
          <Skeleton className="h-[36px] w-full" />
          <Skeleton className="h-[36px] w-full" />
        </div>
      </div>
    );
  };
  const buttonContactAgain = () => (
    <Button
      className="flex items-center gap-x-2 hover:bg-blue-500 hover:text-white"
      variant={'outline'}
    >
      <LuPhoneIncoming />
      Yêu cầu liên hệ lại
    </Button>
  );
  return (
    <div className={cn('author-post z-3 sticky top-16 h-fit min-w-[310px] flex-1', className)}>
      {isLoading || !data?.author?.slug ? (
        loadingAuthor()
      ) : (
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-lg font-semibold">Liên hệ</h3>
          <div className="my-6 flex items-center gap-x-3">
            <Avatar
              onClick={() => router.push(`/profile/${data.author.slug}`)}
              className="h-[80px] w-[80px] cursor-pointer"
            >
              <AvatarImage src={profileData?.avatar_url} />
              <AvatarFallback>{getInitialsName(profileData?.full_name as string)}</AvatarFallback>
            </Avatar>
            <div>
              <strong
                onClick={() => router.push(`/profile/${data.author.slug}`)}
                className="cursor-pointer text-blue-500"
              >
                {profileData?.full_name}
              </strong>
              <p className="text-slate-400">Đã đăng {profileData?.posts_count} tin</p>
            </div>
          </div>
          <div className="my-4">
            {profileData?.formatted_badges &&
              profileData?.formatted_badges.map((item, index) => (
                <li key={genKey(index)}>{item}</li>
              ))}
          </div>
          <div className="flex flex-col gap-y-2">
            <ButtonPhone phoneNumberProfile={profileData?.phone as string} />
            <DialogContactAgain
              elementTrigger={buttonContactAgain}
              postId={data?.id}
              title={data.title}
            />
          </div>
        </div>
      )}
      <PostsBySameAuthor
        fullNameAuthor={profileData?.full_name}
        authorSlug={profileData?.slug}
        productId={data?.uid}
      />
    </div>
  );
};

export default AuthorPost;
