// import { Block } from 'konsta/react';
'use client';
import { Button } from 'konsta/react';
import Image from 'next/image';
import React from 'react';

type ProfileDetailPageProps = {};

const ProfileDetailPage: React.FC<ProfileDetailPageProps> = props => {
  console.log('🚀 ~ props:', props);
  const userProfileInfo = () => (
    <div className='flex flex-col items-center md:flex-row'>
      <div className='relative overflow-hidden rounded-full'>
        <Image
          width={200}
          height={200}
          alt='profile-image'
          src={'https://images.chuannhadat.com/uploads/images/2412/anh_the.jpg?w=250&h=250&c=true&f=webp&q=80'}
        />
      </div>
      <div className=''>
        <h2>Lê Nguyễn</h2>
        <span>Nhà môi giới</span>
        <span>8 năm kinh nghiệm</span>
        <p>🏆 Top 1 bán biệt thự liền kề khu vực Hồ Chí Minh, Huyện Nhà Bè</p>
        <p>🏆 Top 1 bán căn hộ chung cư khu vực Urban Hill</p>
        <p>🏆 Top 1 bán nhà riêng khu vực Phường Phú Thuận</p>
        <p>🏆 Top 1 bán đất khu vực Quận 7, Phường Phú Thuận</p>
        <p>🏆 Top 2 bán căn hộ chung cư khu vực Hồ Chí Minh, Quận 7, Huyện Nhà Bè, Phường Tân Phong, Phường Tân Phú</p>
        <p>🏆 Top 2 bán nhà riêng khu vực Quận 7</p>
        <p>🏆 Top 3 bán đất khu vực Hồ Chí Minh</p>
        <span> Đã tham gia 4 tháng trước</span>
        <span>VP TP HCM Q7</span>
        <Button className='w-fit'>0919594088</Button>
      </div>
    </div>
  );
  return <section className='profile-detail'>{userProfileInfo()}</section>;
};

export default ProfileDetailPage;
