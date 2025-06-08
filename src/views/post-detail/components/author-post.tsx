import { cn, genKey, getInitialsName } from '@common/utils';
import ButtonPhone from '@components/button-phone';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Skeleton } from '@components/ui/skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { AuthorPostProps } from '../type';
import PostsBySameAuthor from './posts-by-same-author';

const AuthorPost: React.FC<AuthorPostProps> = ( { data, className } ) => {
  const dataAuthor = data?.author
  const badgesCount = useMemo( () => {
    return ( dataAuthor?.formatted_badges || [] ).length;
  }, [] );

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
          {new Array( 4 ).fill( 0 ).map( ( _item, index ) => (
            <Skeleton key={genKey( index )} className="h-5 w-full" />
          ) )}
        </div>
        <div className="flex flex-col gap-y-2">
          <Skeleton className="h-[36px] w-full" />
          <Skeleton className="h-[36px] w-full" />
        </div>
      </div>
    );
  };
  return (
    <div className={cn( 'author-post z-3 sticky top-0 h-fit min-w-[350px] flex-1', className )}>
      {!dataAuthor ? (
        loadingAuthor()
      ) : (
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-lg font-semibold">Liên hệ:</h3>
          <div className="my-4 flex items-center gap-x-3">
            <Avatar
              onClick={() => router.push( `/profile/${data.author.slug}` )}
              className="h-[50px] w-[50px] cursor-pointer"
            >
              <AvatarImage src={dataAuthor?.avatar_url} />
              <AvatarFallback>{getInitialsName( dataAuthor?.full_name as string )}</AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/profile/${dataAuthor.slug}`}
                className="cursor-pointer font-bold hover:underline"
              >
                {dataAuthor?.full_name || dataAuthor?.phone}
              </Link>
              <p className="text-sm text-secondary">Đã đăng {dataAuthor?.posts_count} tin</p>
            </div>
          </div>
          {badgesCount > 0 && (
            <div className="my-4 text-secondary">🏆 Đã đạt {badgesCount} danh hiệu môi giới</div>
          )}

          <div className="flex flex-col gap-y-2">
            <ButtonPhone phoneNumberProfile={dataAuthor?.phone as string} />

          </div>
        </div>
      )}
      <PostsBySameAuthor
        fullNameAuthor={dataAuthor?.full_name}
        authorSlug={dataAuthor?.slug}
        productId={data?.uid}
        totalCount={dataAuthor?.posts_count}
      />
    </div>
  );
};

export default AuthorPost;
