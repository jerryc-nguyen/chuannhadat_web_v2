'use client';
import { cn, genKey } from '@common/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import {
  ContactInfor,
  EmailTab,
  PasswordTab,
  PersonalTab,
  ReferFriend,
  PhoneNumberTab,
} from '@views/dashboard/main-account-detail/account-settings/components';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  IBreadcrumbItem,
} from '@views/dashboard/states/breadcrumbAtom';
import { useSetAtom } from 'jotai';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { listTabAccountSetting } from '@views/dashboard/main-account-detail/constants';

const AccountSettingsMobile: React.FC = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab');
  const [tabActive, setTabActive] = React.useState(currentTab || 'personal-wall');
  const router = useRouter();
  const pathname = usePathname();
  const handleChangeTab = (value: string) => {
    setTabActive(value);
    router.push(pathname + '?' + createQueryString('tab', value));
  };
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
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
    setBreadCrumb((state) => {
      return [...state, ...currentBreadCrumn];
    });
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
        className="flex w-full flex-col gap-y-4"
        orientation="horizontal"
      >
        <TabsList className="flex h-fit flex-row overflow-hidden rounded-lg border bg-white p-0">
          {listTabAccountSetting.map((item, index) => (
            <TabsTrigger
              className={cn(
                'm-2 aspect-square rounded-md border p-2 shadow-sm',
                tabActive === item.tabValue ? '!bg-blue-50 !text-blue-500' : 'bg-white',
              )}
              key={genKey(index)}
              value={item.tabValue}
            >
              <item.icon />
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex max-w-screen-lg flex-col justify-between rounded-lg border bg-white p-4 pt-0 dark:bg-slate-900">
          <TabsContent value="personal-wall">
            <PersonalTab />
          </TabsContent>
          <TabsContent value="contact-infor">
            <ContactInfor />
          </TabsContent>
          <TabsContent className="relative flex-1" value="email">
            <EmailTab />
          </TabsContent>
          <TabsContent className="relative flex-1" value="phone-number">
            <PhoneNumberTab />
          </TabsContent>
          <TabsContent value="password">
            <PasswordTab />
          </TabsContent>
          <TabsContent value="refer-friend">
            <ReferFriend />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
};

export default AccountSettingsMobile;
