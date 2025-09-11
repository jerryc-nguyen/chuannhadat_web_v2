'use client';
import { cn } from '@common/utils';
import { IPostProductCard } from '../states';
import styles from '../styles/PostList.module.scss';
import InfiniteProductLoader from './InfiniteProductLoader';

type PostListProps = {
  isShowAuthor?: boolean;
  dataPostList: IPostProductCard[];
  className?: string;
  filterParams?: A;
  currentPage?: number;
};
export default function PostList({
  isShowAuthor = true,
  dataPostList,
  className,
  filterParams,
  currentPage = 1,
}: PostListProps) {
  return (
    <>
      <div className={styles.post_list_wrapper}>
        <div className={cn(styles.post_list, className)}>
          <InfiniteProductLoader
            initialProducts={dataPostList}
            filterParams={filterParams}
            currentPage={currentPage}
            isShowAuthor={isShowAuthor}
          />
        </div>
      </div>
    </>
  );
}
