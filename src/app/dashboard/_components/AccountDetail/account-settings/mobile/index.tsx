'use client';
import { Tabs, TabsContent } from '@components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { listTabAccountSetting } from '@dashboard/AccountDetail/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useAccountSettingsTabBreadcrumb } from '../../hooks';
import MobileContainer from '@dashboard/FinancialManagement/components/MobileContainer';

const AccountSettingsMobile: React.FC = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab');
  const [tabActive, setTabActive] = React.useState(currentTab || 'personal-wall');
  const router = useRouter();
  const pathname = usePathname() || '';
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
  // Set up breadcrumb based on current tab
  useAccountSettingsTabBreadcrumb(tabActive);
  return (
    <MobileContainer>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Cài đặt tài khoản</h1>

        {/* Mobile Dropdown Navigation */}
        <Select value={tabActive} onValueChange={handleChangeTab}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                {(() => {
                  const currentTabData = listTabAccountSetting.find(tab => tab.tabValue === tabActive);
                  return currentTabData ? (
                    <>
                      <currentTabData.icon className="h-4 w-4" />
                      <span>{currentTabData.title}</span>
                    </>
                  ) : null;
                })()}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {listTabAccountSetting.map((item) => (
              <SelectItem key={item.tabValue} value={item.tabValue}>
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs
          onValueChange={handleChangeTab}
          value={tabActive}
          className="w-full"
          orientation="horizontal"
        >
          <div className="flex max-w-screen-lg flex-col justify-between rounded-lg border bg-white p-4 pt-0 dark:bg-slate-900">
            {listTabAccountSetting.map((tab) => (
              <TabsContent key={tab.title} className="p-4" value={tab.tabValue}>
                <tab.tabComponent />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </MobileContainer>
  );
};

export default AccountSettingsMobile;
