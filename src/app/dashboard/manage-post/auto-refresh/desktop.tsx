'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@components/ui/button';
import { LuCheck, LuClipboardEdit, LuTrash2 } from 'react-icons/lu';
import { useSetAtom } from 'jotai';
import { breadcrumbAtom, IBreadcrumbItem } from '@desktop/dashboard/atoms/breadcrumbAtom';
import timeIcon from '@assets/icons/time.svg';
import Image from 'next/image';

type AutoRefreshDesktopProps = object;

const AutoRefreshDesktop: React.FC<AutoRefreshDesktopProps> = () => {
  const setBreadCrumb = useSetAtom(breadcrumbAtom);
  React.useEffect(() => {
    const currentBreadCrumn: IBreadcrumbItem[] = [
      {
        link: 'manage-post',
        title: 'Manage-Post',
        isActive: true,
      },
      {
        link: 'auto-refresh',
        title: 'Auto-Refresh',
        isActive: true,
      },
    ];
    setBreadCrumb((state) => [...state, ...currentBreadCrumn]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addTimeRefresh = () => (
    <form>
      <label
        htmlFor="time"
        className="mb-4 block border-l-4 border-slate-500 pl-2 text-xl font-bold text-gray-900 dark:text-white"
      >
        Thêm thời gian
      </label>
      <div className="relative max-w-[8rem]">
        <div className="pointer-events-none absolute inset-y-0 end-0 top-0 flex items-center pe-3.5">
          <Image src={timeIcon} alt="ic_eyy_off" width={16} height={16} />
        </div>
        <input
          type="time"
          id="time"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          min="09:00"
          max="18:00"
          defaultValue="00:00"
          required
        />
      </div>
    </form>
  );

  const numberRefreshPost = () => (
    <div>
      <h2 className="mb-4 border-l-4 border-slate-500 pl-2 text-xl font-bold">Số lần làm mới</h2>
      <div className="mt-2 flex w-1/2 justify-between gap-x-4">
        <Card className="flex-1 hover:bg-blue-50">
          <CardHeader>
            <CardTitle className="dark:text-slate-400">Miễn phí</CardTitle>
            <CardDescription className="text-2xl font-bold text-blue-500">0 lần</CardDescription>
          </CardHeader>
        </Card>
        <Card className="flex-1 hover:bg-yellow-50">
          <CardHeader>
            <CardTitle className="dark:text-slate-400">Đã mua</CardTitle>
            <CardDescription className="text-2xl font-bold text-yellow-500">0 lần</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  const refreshSettingsTable = () => (
    <div>
      <h2 className="mb-4 border-l-4 border-slate-500 pl-2 text-xl font-bold">
        Bảng cài đặt thời gian
      </h2>
      <Table className="max-w-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-black">Thời gian</TableHead>
            <TableHead className="font-bold text-black">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-sm">08:00 (Sáng)</TableCell>
            <TableCell>
              <Button className="mr-2 bg-green-500 hover:bg-green-600">
                <LuClipboardEdit className="mr-2" />
                Cập nhật
              </Button>
              <Button className="bg-red-500 hover:bg-red-600">
                <LuTrash2 className="mr-2" />
                Xóa
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='className="text-sm"'>14:00 (Chiều)</TableCell>
            <TableCell>
              <Button className="mr-2 bg-green-500 hover:bg-green-600">
                <LuClipboardEdit className="mr-2" />
                Cập nhật
              </Button>
              <Button className="bg-red-500 hover:bg-red-600">
                <LuTrash2 className="mr-2" />
                Xóa
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
  const cardPackage = () => (
    <Card className="max-w-[300px] flex-1 border-2 hover:border-blue-300">
      <CardHeader className="pb-[15px]">
        <CardTitle className="font-bold text-slate-500">GÓI 1</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="pb-4 text-xl font-bold text-[#596570]">
          <strong className="mr-2 text-[28px] font-bold text-black dark:text-white">$66</strong>/
          tháng
        </p>
        <p className="text-sm font-medium">
          Gói làm mới tin đăng giúp bạn tiết kiệm thời gian và đẩy tin lên top
        </p>
        <Button className="mt-5 w-full bg-blue-600 hover:bg-blue-500">Mua ngay</Button>

        <div>
          <span className="inline-block pt-3 text-sm text-slate-500">Ưu đãi bao gồm :</span>
          <ul className="mt-4">
            <li className="mb-2 flex items-center gap-x-2 text-sm">
              <LuCheck className="text-blue-400" />
              <span>Số lần làm mới tin: 300</span>
            </li>
            <li className="my-2 flex items-center gap-x-2 text-sm">
              <LuCheck className="text-blue-400" />
              <span>Số lần làm mới tin: 300</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
  const refeshListPackage = () => (
    <div>
      <h2 className="mb-4 border-l-4 border-slate-500 pl-2 text-xl font-bold">Các gói đăng tin</h2>
      <div className="flex gap-x-4">
        {cardPackage()}
        {cardPackage()}
        {cardPackage()}
      </div>
    </div>
  );
  return (
    <section className="flex flex-col gap-y-6">
      <h1 className="text-4xl font-bold">Cài đặt tự động làm mới </h1>
      {addTimeRefresh()}
      {numberRefreshPost()}
      {refreshSettingsTable()}
      {refeshListPackage()}
    </section>
  );
};

export default AutoRefreshDesktop;
