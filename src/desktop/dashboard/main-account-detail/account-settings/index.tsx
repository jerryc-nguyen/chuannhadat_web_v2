'use client';
import { cn, genKey } from '@common/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

import {
  breadcrumbAtom,
  defaultBreadcrumb,
  IBreadcrumbItem,
} from '@desktop/dashboard/states/breadcrumbAtom';
import { useSetAtom } from 'jotai';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { listTabAccountSetting } from '../constants';

const AccountSettingsDesktop: React.FC = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const [tabActive, setTabActive] = React.useState(currentTab || 'personal-wall');
  const router = useRouter();
  const pathname = usePathname();
  const handleChangeTab = (value: string) => {
    setTabActive(value);
    router.push(pathname + '?' + createQueryString('tab', value));
  };
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  const setBreadCrumb = useSetAtom(breadcrumbAtom);

  React.useEffect(() => {
    const currentBreadCrumn: IBreadcrumbItem[] = [
      {
        link: '/account-settings',
        title: 'Cài đặt tài khoản',
        isActive: true,
      },
    ];
    setBreadCrumb((state) => [...state, ...currentBreadCrumn]);
    return () => {
      setBreadCrumb(defaultBreadcrumb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Cài đặt tài khoản </h1>
      <Tabs
        onValueChange={handleChangeTab}
        value={tabActive}
        className="flex w-full gap-x-4"
        orientation="horizontal"
      >
        <TabsList className="sticky top-0 flex h-fit flex-col overflow-hidden rounded-lg border bg-white p-0 dark:bg-slate-900">
          {listTabAccountSetting.map((item, index) => (
            <TabsTrigger
              className={cn(
                'w-full items-center justify-start gap-x-4 rounded-none border-none px-4 py-2 text-base font-medium !shadow-none transition-all',
                tabActive === item.tabValue
                  ? '!bg-slate-200 !text-black dark:!bg-white dark:!text-slate-900'
                  : '',
              )}
              key={genKey(index)}
              value={item.tabValue}
            >
              <span
                className={cn(
                  'aspect-square rounded-md border bg-white p-2 shadow-sm dark:border-slate-400 dark:bg-slate-900',
                  tabActive === item.tabValue ? 'text-black dark:text-white' : '',
                )}
              >
                <item.icon />
              </span>
              <span className="hidden xl:block">{item.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex h-full min-h-[297px] max-w-screen-lg flex-1 flex-col justify-between rounded-lg border bg-white p-4 pt-0 dark:bg-slate-900">
          {listTabAccountSetting.map((tab) => (
            <TabsContent key={tab.title} className="p-4" value={tab.tabValue}>
              <tab.tabComponent />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </section>
  );
};

export default AccountSettingsDesktop;
