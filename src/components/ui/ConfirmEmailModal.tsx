'use client';
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { toast } from 'sonner';
import { LuLoader2 } from 'react-icons/lu';
import { AxiosError } from 'axios';
import useAuth from '@mobile/auth/hooks/useAuth';

const ConfirmEmailModal: React.FC = () => {
  const { updateCurrentUser } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const emailToken = params.get('confirm_email_token');
  const [showConfirmEmail, setShowConfirmEmail] = React.useState(!!emailToken);
  const { data: profileMe } = useQuery({
    queryKey: ['get-profile-me'],
    queryFn: services.profiles.getMyProfile,
    select: (data) => data.data,
  });
  React.useEffect(() => {
    if (profileMe) {
      updateCurrentUser(profileMe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileMe]);
  const { mutate: confirmEmail, isPending } = useMutation({
    mutationFn: services.profiles.confirmEmail,
    onError: (err: AxiosError<A>) => {
      toast.error(`Xác thực email không thành công ${err.message}`);
    },
    onSuccess: (data: A) => {
      if (data.status) {
        toast.success('Xác thực email thành công');
        queryClient.invalidateQueries({ queryKey: ['get-profile-me'] });
        router.replace('/', undefined);
      } else {
        toast.error(data.message);
      }
    },
  });
  const handleConfirmEmail = () => {
    confirmEmail(emailToken as string);
  };
  return (
    <AlertDialog open={showConfirmEmail} onOpenChange={setShowConfirmEmail}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác Nhận Cập Nhật Email</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xác nhận cập nhật email? Hành động này sẽ hoàn tất quá trình thay
            đổi địa chỉ email của bạn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              router.replace('/', undefined);
              setShowConfirmEmail(false);
            }}
          >
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmEmail} disabled={isPending}>
            {isPending && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmEmailModal;
