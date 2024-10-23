'use client';
import ModalPostDetail from '@desktop/post-detail/components/modal-post-detail';
import ProductCard from './ProductCard';
import styles from '../styles/PostList.module.scss';
import React from 'react';
import { IPostProductCard } from '../states';
import { cn } from '@common/utils';

type PostListProps = {
  isShowAuthor?: boolean;
  dataPostList: IPostProductCard[];
  className?: string;
};
export default function PostList({ isShowAuthor = true, dataPostList, className }: PostListProps) {
  return (
    <>
      <div className={styles.post_list_wrapper}>
        <ModalPostDetail />
        <div className={cn('post_list', className)}>
          {dataPostList.map((product) => {
            return <ProductCard isShowAuthor={isShowAuthor} product={product} key={product?.id} />;
          })}
        </div>
      </div>
    </>
  );
}
