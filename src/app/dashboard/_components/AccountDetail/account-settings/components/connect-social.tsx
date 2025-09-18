'use client';
import { cn } from '@common/utils';
import { Switch } from '@components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import Image from 'next/image';
import React, { useState } from 'react';
import { GoogleIcon } from '@components/icons/CustomIcons';
import { LoadingSpinner } from '@components/icons/CustomIcons';
import { toast } from 'sonner';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@common/firebase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { oauthApi } from '../../api/oauth';
import { Skeleton } from '@components/ui/skeleton';

interface IDataConnectResponse {
  uid: string;
  name: string;
  email: string;
  photo: string;
}

const ConnectSocial: React.FC = () => {
  const [loadingConnectGoogle, setLoadingConnectGoogle] = useState(false);
  const [dataGoogle, setDataGoogle] = useState<IDataConnectResponse | undefined>(undefined);
  const queryClient = useQueryClient();
  const { data: oauthsData, isFetching } = useQuery({
    queryKey: ['get-oauths'],
    queryFn: oauthApi.getOauths,
    select: (data) => data.data,
  });
  const { mutate: deleteMutation } = useMutation({
    mutationFn: oauthApi.deleteOauth,
    onSuccess: () => {
      toast.success('Hủy liên kết thành công');
    },
    onError: (err) => {
      toast.error('Hủy liên kết thất bại' + err);
    },
  });

  React.useEffect(() => {
    if (!isFetching) {
      const dataGoogle = oauthsData?.find((item: A) => item.provider === 'google_oauth2');
      if (dataGoogle) {
        setDataGoogle({
          email: dataGoogle.email,
          name: dataGoogle.oauth_name,
          photo: dataGoogle.oauth_avatar,
          uid: dataGoogle.id,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, oauthsData]);

  const { mutate: connectGoogle } = useMutation({
    mutationFn: oauthApi.connectGoogle,
    onError: (error) => {
      toast.error('Liên kết google thất bại' + error);
      setLoadingConnectGoogle(false);
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ['get-oauths'],
        })
        .then(() => {
          setLoadingConnectGoogle(false);
        });
      toast.success('Liên kết google thành công');
    },
  });

  const handleConnectGoogle = async (checked: boolean) => {
    if (checked) {
      try {
        setLoadingConnectGoogle(true);
        const response = (await signInWithPopup(auth, googleProvider)) as A;
        const data = response.user.providerData[0];
        connectGoogle({
          email: data.email,
          name: data.displayName,
          photo: data.photoURL,
          uid: data.uid,
        });
      } catch (error) {
        toast.error('Liên kết google thất bại ' + error);
      }
    } else {
      setDataGoogle(undefined);
      await signOut(auth).then(() => {
        deleteMutation(dataGoogle?.uid as string);
      });
    }
  };
  const renderLoadingData = () => (
    <TableRow>
      <TableCell className="flex items-center gap-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-2 w-[160px]" />
        </div>
      </TableCell>
      <TableCell className="">
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-11 rounded-full" />
      </TableCell>
    </TableRow>
  );
  const onRenderTableBody = () => {
    if (!oauthsData && !dataGoogle) {
      return (
        <TableBody>
          {renderLoadingData()}
          {renderLoadingData()}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          <TableRow>
            <TableCell className="flex items-center gap-x-3">
              <GoogleIcon className="text-3xl" />
              <div className="flex flex-col">
                <p className="font-semibold text-success_color">Google</p>
                <span className="text-xs text-secondary">
                  {dataGoogle ? dataGoogle.email : 'Google chưa được liên kết'}
                </span>
              </div>
            </TableCell>
            <TableCell className="">
              {dataGoogle ? (
                <div className="flex items-center gap-x-2">
                  <Image
                    alt=""
                    height={40}
                    width={40}
                    className="h-10 w-10 rounded-full bg-slate-300"
                    src={dataGoogle.photo}
                  />
                  <span className="font-medium">{dataGoogle.name}</span>
                </div>
              ) : (
                'Không có thông tin'
              )}
            </TableCell>
            <TableCell className={cn(dataGoogle ? 'text-success_color' : 'text-black')}>
              {dataGoogle ? 'Đã kết nối' : 'Chưa kết nối'}
            </TableCell>
            <TableCell>
              <div className="flex h-6 w-11 items-center justify-center rounded-full">
                <Switch
                  checked={!!dataGoogle}
                  onCheckedChange={handleConnectGoogle}
                  className={cn(
                    dataGoogle
                      ? '!bg-success_color'
                      : loadingConnectGoogle
                        ? 'invisible w-0 opacity-0'
                        : 'visible opacity-100',
                    'transition-all',
                  )}
                  id="facbook-mode"
                />
                <LoadingSpinner
                  className={cn(
                    'animate-spin transition-all',
                    loadingConnectGoogle
                      ? 'visible h-6 w-6 opacity-100'
                      : 'invisible h-0 w-0 opacity-0',
                  )}
                />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
  };
  return (
    <section>
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Liên kết tài khoản</h3>
      </div>
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-black">Tài khoản</TableHead>
            <TableHead className="font-semibold text-black">Thông tin</TableHead>
            <TableHead className="font-semibold text-black">Trạng thái</TableHead>
            <TableHead className="font-semibold text-black">Kết nối</TableHead>
          </TableRow>
        </TableHeader>
        {onRenderTableBody()}
      </Table>
    </section>
  );
};

export default ConnectSocial;
