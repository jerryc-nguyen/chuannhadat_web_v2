'use client';
import { services } from '@api/services';
import { REFERRAL_CODE } from '@common/auth';
import { getCookie, removeCookie } from '@common/cookies';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { useAuth } from '@common/auth/AuthContext';
import { LoginResponse } from '@mobile/auth/types';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { GoogleIcon } from '@components/icons/CustomIcons';
import { toast } from 'sonner';

// Dynamic Firebase imports - loaded only when needed
type FirebaseModules = {
  auth: import('firebase/auth').Auth;
  googleProvider: import('firebase/auth').GoogleAuthProvider;
  signInWithPopup: typeof import('firebase/auth').signInWithPopup;
};

type LoginSocialProps = {
  handleSuccessLogin?: () => void;
  className?: string;
};

// Dynamic Firebase loader function
const loadFirebaseModules = async (): Promise<FirebaseModules> => {
  try {
    const [firebaseConfig, firebaseAuth] = await Promise.all([
      import('@common/firebase'),
      import('firebase/auth')
    ]);

    return {
      auth: firebaseConfig.auth,
      googleProvider: firebaseConfig.googleProvider,
      signInWithPopup: firebaseAuth.signInWithPopup,
    };
  } catch (error) {
    throw new Error('Firebase could not be loaded');
  }
};

const LoginSocial: React.FC<LoginSocialProps> = ({ handleSuccessLogin, className }) => {
  const [loadingLoginGoogle, setLoadingLoginGoogle] = React.useState(false);
  const [loadingFirebase, setLoadingFirebase] = React.useState(false);
  const { login } = useAuth();
  const { mutate: loginGoogle } = useMutation({
    mutationFn: services.auth.loginGoogle,
    onSuccess: (response: LoginResponse) => {
      if (response.status) {
        const userData = response.data;

        // Use the new AuthContext login method
        login(
          userData.api_token,
          userData
        );

        toast.success(
          `Xin chào, ${userData.full_name || userData.phone} bạn đã đăng nhập thành công!`,
        );
        handleSuccessLogin && handleSuccessLogin();
      } else {
        toast.error('Đăng nhập bằng google không thành công');
      }
      removeCookie(REFERRAL_CODE);
      setLoadingLoginGoogle(false);
      setLoadingFirebase(false);
    },
    onError: (error) => {
      toast.error('Đăng nhập google thất bại' + error);
      setLoadingLoginGoogle(false);
      setLoadingFirebase(false);
    },
  });
  const handleSignInGoogle = async () => {
    try {
      setLoadingFirebase(true);
      setLoadingLoginGoogle(true);

      // Dynamically load Firebase modules only when needed
      const { auth, googleProvider, signInWithPopup } = await loadFirebaseModules();

      setLoadingFirebase(false);

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
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập google không thành công';
      toast.error(`Đăng nhập google không thành công: ${errorMessage}`);
      setLoadingLoginGoogle(false);
      setLoadingFirebase(false);
    }
  };

  return (
    <section className={cn('mb-4 flex items-center justify-center gap-x-3 text-sm', className)}>
      <Button
        disabled={loadingLoginGoogle || loadingFirebase}
        onClick={handleSignInGoogle}
        className="flex h-full flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-md border border-primary_color/30 bg-white px-0 py-3 text-black shadow-lg hover:bg-white"
      >
        {loadingLoginGoogle || loadingFirebase ? (
          <Loader2 className="animate-spin text-xl transition-all" />
        ) : (
          <GoogleIcon className="text-2xl sm:text-xl" />
        )}
        <span className="font-semibold">
          {loadingFirebase ? 'Đang tải...' : 'Đăng nhập bằng Google'}
        </span>
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
