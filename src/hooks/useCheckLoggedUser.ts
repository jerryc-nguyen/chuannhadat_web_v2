import { services } from '@api/services';
import useAuth from '@mobile/auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function useCheckLoggedUser() {
  const router = useRouter();
  const { signOut, updateCurrentUser } = useAuth();
  const { data, isFetching } = useQuery({
    queryKey: ['get-profile-me'],
    queryFn: services.profiles.getMyProfile,
  });

  if (isFetching) {
    return;
  }

  if (data?.data) {
    updateCurrentUser(data?.data);
  } else {
    toast.error('Bạn phải đăng nhập để truy cập trang này.');
    signOut();
    router.push('/');
  }
}
