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
import { toast } from 'sonner';

// Custom Google icon component since Lucide doesn't include branded icons
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

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
