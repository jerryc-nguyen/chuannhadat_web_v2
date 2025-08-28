'use client';
import { cn } from '@common/utils';
import { IPostProductCard } from '../states';
import styles from '../styles/PostList.module.scss';
import ProductCard from './ProductCard';

type PostListProps = {
  isShowAuthor?: boolean;
  dataPostList: IPostProductCard[];
  className?: string;
};
export default function PostList({ isShowAuthor = true, dataPostList, className }: PostListProps) {
  return (
    <>
      <div className={styles.post_list_wrapper}>
        <div className={cn(styles.post_list, className)}>
          {dataPostList?.map((product, index) => {
            return (
              <ProductCard
                isShowAuthor={isShowAuthor}
                product={product}
                key={product?.id}
                isFirstProduct={index === 0}
                productIndex={index}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
