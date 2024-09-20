import { services } from '@api/services';
import { cn, genKey } from '@common/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';

import { Skeleton } from '@components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { LuPhoneCall, LuPhoneIncoming } from 'react-icons/lu';
import { AuthorPostProps, StatusPhoneNumber } from '../type';

import DialogContactAgain from '@components/dialog-contact-again';

const AuthorPost: React.FC<AuthorPostProps> = ({ data, className }) => {
  const [phoneNumber, setPhoneNumber] = React.useState<string>();
  const [textButtonPhone, setTextButtonPhone] = React.useState<string>(StatusPhoneNumber.normal);
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['get-profile', data?.author?.slug],
    queryFn: () => services.profiles.getProfileSlug(data?.author?.slug),
    enabled: !!data?.author?.slug,
    select: (data) => data.data,
  });

  React.useEffect(() => {
    if (!isLoading && profileData) {
      setPhoneNumber(profileData.phone.slice(0, -4) + 'xxxx');
    }
  }, [isLoading, profileData]);

  React.useEffect(() => {
    if (textButtonPhone === StatusPhoneNumber.copied) {
      setTimeout(() => {
        setTextButtonPhone(StatusPhoneNumber.copy);
      }, 2000);
    }
  }, [textButtonPhone]);

  const handleClickButtonPhone = async () => {
    if (textButtonPhone === StatusPhoneNumber.copy) {
      const text = document.getElementById('phone-number')?.innerHTML;
      try {
        await navigator.clipboard.writeText(text || '');
        setTextButtonPhone(StatusPhoneNumber.copied);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
    if (textButtonPhone === StatusPhoneNumber.normal) {
      setPhoneNumber(profileData?.phone);
      setTextButtonPhone(StatusPhoneNumber.copy);
    }
  };
  const loadingAuthor = () => {
    return (
      <div className="author-post h-fit flex-1 rounded-md bg-white p-8">
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

  if (isLoading || !data?.author?.slug) return loadingAuthor();
  return (
    <div
      className={cn(
        'author-post sticky top-16 z-10 h-fit min-w-[310px] flex-1 rounded-lg bg-white p-8',
        className,
      )}
    >
      <h3 className="text-lg font-semibold">Liên hệ</h3>
      <div className="my-6 flex items-center gap-x-3">
        <Avatar className="h-[100px] w-[100px]">
          <AvatarImage src={profileData?.avatar_url} />
          <AvatarFallback>Author</AvatarFallback>
        </Avatar>
        <div>
          <strong className="text-blue-500">{profileData?.full_name}</strong>
          <p className="text-slate-400">Đã đăng {profileData?.posts_count} tin</p>
        </div>
      </div>
      <div className="my-4">
        {profileData?.formatted_badges &&
          profileData?.formatted_badges.map((item, index) => <li key={genKey(index)}>{item}</li>)}
      </div>
      <div className="flex flex-col gap-y-2">
        <Button
          onClick={handleClickButtonPhone}
          className="flex h-fit items-center justify-center gap-x-2 bg-blue-500 text-white hover:bg-blue-400 hover:text-white"
          variant={'outline'}
        >
          <span className="flex items-center gap-x-2">
            <LuPhoneCall />
            <span id="phone-number">{phoneNumber}</span>
          </span>
          <span>{textButtonPhone}</span>
        </Button>
        <DialogContactAgain
          elementTrigger={
            <Button
              className="flex items-center gap-x-2 hover:bg-blue-500 hover:text-white"
              variant={'outline'}
            >
              <LuPhoneIncoming />
              Yêu cầu liên hệ lại
            </Button>
          }
          postId={data?.id}
          title={data.title}
        />
      </div>
    </div>
  );
};

export default AuthorPost;
