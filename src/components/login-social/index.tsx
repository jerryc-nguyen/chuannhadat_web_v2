'use client';
import { services } from '@api/services';
import { REFERRAL_CODE } from '@common/auth';
import { getCookie, removeCookie } from '@common/cookies';
import { auth, googleProvider } from '@common/firebase';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import useAuth from '@mobile/auth/hooks/useAuth';
import { LoginResponse } from '@mobile/auth/types';
import { useMutation } from '@tanstack/react-query';
import { signInWithPopup } from 'firebase/auth';
import React from 'react';
// import { BsQrCode } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import { FcGoogle } from 'react-icons/fc';
// import { IoLogoFacebook } from 'react-icons/io5';
import { toast } from 'sonner';

type LoginSocialProps = {
  handleSuccessLogin?: () => void;
  className?: string;
};

const LoginSocial: React.FC<LoginSocialProps> = ({ handleSuccessLogin, className }) => {
  const [loadingLoginGoogle, setLoadingLoginGoogle] = React.useState(false);
  const { handleSignIn } = useAuth();
  const { mutate: loginGoogle } = useMutation({
    mutationFn: services.auth.loginGoogle,
    onSuccess: (response: LoginResponse) => {
      if (response.status) {
        const userData = response.data;
        handleSignIn(userData);
        toast.success(
          `Xin chào, ${userData.full_name || userData.phone} bạn đã đăng nhập thành công!`,
        );
        handleSuccessLogin && handleSuccessLogin();
      } else {
        toast.error('Đăng nhập bằng google không thành công');
      }
      removeCookie(REFERRAL_CODE);
      setLoadingLoginGoogle(false);
    },
    onError: (error) => {
      toast.error('Đăng nhập google thất bại' + error);
      setLoadingLoginGoogle(false);
    },
  });
  const handleSignInGoogle = async () => {
    try {
      setLoadingLoginGoogle(true);
      const response = (await signInWithPopup(auth, googleProvider)) as A;
      const data = response.user.providerData[0];
      loginGoogle({
        email: data.email,
        name: data.displayName,
        photo: data.photoURL,
        uid: data.uid,
        referral_code: getCookie(REFERRAL_CODE),
      });
    } catch (error) {
      toast.error('Đăng nhập google không thành công' + error);
      setLoadingLoginGoogle(false);
    }
  };

  return (
    <section className={cn('mb-4 flex items-center justify-center gap-x-3 text-sm', className)}>
      <Button
        disabled={loadingLoginGoogle}
        onClick={handleSignInGoogle}
        className="flex h-full flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-md border border-primary_color/30 bg-white px-0 py-3 text-black shadow-lg hover:bg-white"
      >
        {loadingLoginGoogle ? (
          <CgSpinner className="animate-spin text-xl transition-all" />
        ) : (
          <FcGoogle className="text-2xl sm:text-xl" />
        )}
        <span className="font-semibold">Đăng nhập bằng Google</span>
      </Button>
      {/* <div
        onClick={() => toast.warning('Chức năng này hiện đang trong quá trình phát triển')}
        className="flex flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-md border border-primary_color/30 py-3 shadow-lg"
      >
        <IoLogoFacebook className="text-2xl text-blue-500 sm:text-xl" />
        <span className="hidden sm:block">Facebook</span>
      </div>
      <div
        onClick={() => toast.warning('Chức năng này hiện đang trong quá trình phát triển')}
        className="flex h-full flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-md border border-primary_color/30 py-3 shadow-lg"
      >
        <BsQrCode className="h-6 w-6 text-primary_color sm:h-4 sm:w-4" />
        <span className="hidden sm:block"> QR</span>
      </div> */}
    </section>
  );
};

export default LoginSocial;
