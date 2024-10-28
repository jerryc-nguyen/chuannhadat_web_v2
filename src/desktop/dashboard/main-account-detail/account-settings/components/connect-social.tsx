import { cn } from '@common/utils';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { useGoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { jwtDecode } from 'jwt-decode';

const ConnectSocial: React.FC = () => {
  const [isConnectFacebook, setIsConnectFacebook] = useState(false);
  const [isConnectGoogle, setIsConnectGoogle] = useState(false);
  const connectGoogle = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log('🚀 ~ credentialResponse:', credentialResponse);
      const decoded = jwtDecode(credentialResponse.access_token);
      console.log('credentialResponse', decoded);
    },
  });
  const handleConnectGoogle = (checked: boolean) => {
    if (checked) {
      connectGoogle();
    }
  };

  return (
    <section>
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Liên kết tài khoản</h3>
        <p className="text-xs text-slate-400">
          Liên kết tài khoản của bạn với facebook hoặc google để dễ dàng đăng nhập
        </p>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="">Tài khoản</TableHead>
            <TableHead className="">Thông tin</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Kết nối</TableHead>
            <TableHead>Social</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="flex items-center gap-x-3">
              <FaFacebook className="text-2xl text-primary_color" />
              <div className="flex flex-col">
                <p className="font-semibold text-primary_color">Facebook</p>
                <span className="text-xs text-muted-foreground">Facebook chưa được liên kết</span>
              </div>
            </TableCell>
            <TableCell className="">Không có thông tin</TableCell>
            <TableCell>Chưa kết nối</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isConnectFacebook}
                  onCheckedChange={setIsConnectFacebook}
                  className={cn(isConnectFacebook ? '!bg-primary_color' : '')}
                  id="facbook-mode"
                />
                <Label htmlFor="facbook-mode">Kết nối</Label>
              </div>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="flex items-center gap-x-3">
              <FcGoogle className="text-3xl" />
              <div className="flex flex-col">
                <p className="font-semibold text-success_color">Google</p>
                <span className="text-xs text-muted-foreground">Google chưa được liên kết</span>
              </div>
            </TableCell>
            <TableCell className="">Không có thông tin</TableCell>
            <TableCell>Chưa kết nối</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isConnectGoogle}
                  onCheckedChange={handleConnectGoogle}
                  className={cn(isConnectGoogle ? '!bg-success_color' : '')}
                  id="facbook-mode"
                />
                <Label htmlFor="facbook-mode">Kết nối</Label>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default ConnectSocial;
