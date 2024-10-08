'use client';
import ModalPostDetail from '@desktop/post-detail/components/modal-post-detail';
import ProductCard from './ProductCard';
import styles from '../styles/post-list.module.scss';
import React from 'react';
import { IPostProductCard } from '../states';
type PostListProps = {
  isShowAuthor?: boolean;
  dataPostList: IPostProductCard[];
};
export default function PostList({ isShowAuthor = true, dataPostList}: PostListProps) {
  return (
    <>
      <div className={styles.post_list_wrapper}>
        <ModalPostDetail />
        <div className="post_list">
          {dataPostList.map((product) => {
            return <ProductCard key={product?.id} isShowAuthor={isShowAuthor} product={product} />;
          })}
        </div>
      </div>
    </>
  );
}
