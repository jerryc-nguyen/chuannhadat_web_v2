'use client';
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { LuLoader2 } from 'react-icons/lu';
import { useAuth } from '@common/auth/AuthContext';

const ConfirmEmailModal: React.FC = () => {
  const { updateCurrentUser } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const emailToken = params?.get('confirm_email_token');
  const [showConfirmEmail, setShowConfirmEmail] = React.useState(false);
  const [isConfirmSuccess, setIsConfirmSuccess] = React.useState(false);
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
    onError: () => {
      router.replace('/', undefined);
    },
    onSuccess: (data: A) => {
      if (data.status) {
        setIsConfirmSuccess(true);
        setShowConfirmEmail(true);
        queryClient.invalidateQueries({ queryKey: ['get-profile-me'] });
      } else {
        setShowConfirmEmail(true);
        setIsConfirmSuccess(false);
      }
    },
  });

  React.useEffect(() => {
    if (emailToken) {
      confirmEmail(emailToken as string);
    }
  }, [confirmEmail, emailToken]);

  return (
    <AlertDialog open={showConfirmEmail} onOpenChange={setShowConfirmEmail}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {isConfirmSuccess && (
            <>
              <AlertDialogTitle>Xác nhận email thành công!</AlertDialogTitle>
              <AlertDialogDescription>
                <p>
                  Địa chỉ email <b>{profileMe?.unconfirmed_email || profileMe?.email}</b> đã được
                  xác thực thành công.
                </p>
              </AlertDialogDescription>
            </>
          )}

          {!isConfirmSuccess && (
            <>
              <AlertDialogTitle>Xác nhận email không thành công!</AlertDialogTitle>
              <AlertDialogDescription>
                <p>Mã xác thực email không tồn tại.</p>
                <p>
                  Bạn có thể gửi lại mã xác thực email tại mục <b>Cài đặt tài khoản</b> /{' '}
                  <b>Email</b>
                </p>
              </AlertDialogDescription>
            </>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              router.replace('/', undefined);
              setShowConfirmEmail(false);
            }}
            disabled={isPending}
          >
            {isPending && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmEmailModal;
