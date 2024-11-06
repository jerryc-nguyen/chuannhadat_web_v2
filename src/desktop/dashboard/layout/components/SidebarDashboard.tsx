'use client';
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from '@components/ui/sidebar';
import { listNavDashboard } from '../constants';
import styles from '../styles/SidebarDashboard.module.scss';
import Link from 'next/link';
import Logo from '@components/logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@components/ui/collapsible';
import { cn, genKey } from '@common/utils';

import { usePathname } from 'next/navigation';
import { FaAngleRight } from 'react-icons/fa6';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { LuCreditCard } from 'react-icons/lu';
import { useBalanceRequest } from '@api/balance';
type SidebarDashboardProps = object;

const SidebarDashboard: React.FC<SidebarDashboardProps> = () => {
  const { balanceData, fetchBalance } = useBalanceRequest();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const getActiveLink = (url: string) => {
    return pathname.includes(url) ? 'bg-slate-200 text-black' : '';
  };

  React.useEffect(() => {
    const loadBalance = async () => {
      try {
        await fetchBalance();
      } catch (error) {
        console.error('Error loading balance', error);
      }
    };
    loadBalance();
  }, [fetchBalance]);
  return (
    <Sidebar className={styles.sidebarWrapper} collapsible="offcanvas">
      <SidebarHeader className="flex h-[70px] items-center justify-center">
        <Logo isDashboard />
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        <SidebarGroup>
          <SidebarGroupLabel>Danh sách cài đặt</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {listNavDashboard.map((nav) => (
                <Collapsible key={nav.name} defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={pathname.includes(nav.name as string)}
                        className="h-10 cursor-pointer transition-all hover:!bg-slate-200 group-data-[collapsible=icon]:!size-10"
                        asChild
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-2">
                            <nav.icon className="!h-6 !w-6" />
                            <span className="text-base font-medium">{nav.name}</span>
                          </div>
                          <FaAngleRight className="icon-arrow transition-all" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-1">
                      <SidebarMenuSub>
                        {nav.links?.map((navLink, index) => (
                          <SidebarMenuSubItem
                            onClick={() => setOpenMobile(false)}
                            className={cn(
                              'rounded-md px-4 py-2 !text-base transition-all hover:cursor-pointer hover:bg-slate-200 hover:text-black',
                              getActiveLink(navLink.url),
                            )}
                            key={genKey(index)}
                          >
                            <Link href={`/dashboard/${navLink.url}`}>{navLink.name}</Link>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Card className="rounded-md p-3" x-chunk="dashboard-02-chunk-0">
          <CardHeader className="rounded-sm border p-2 text-center hover:bg-slate-50">
            <CardDescription className="font-medium text-slate-600">
              Tài khoản chính
            </CardDescription>
            <CardTitle className="!mt-0 text-lg font-bold text-green-600">
              {balanceData?.tk_chinh}
            </CardTitle>
          </CardHeader>
          <CardHeader className="my-2 rounded-sm border p-2 text-center hover:bg-slate-50">
            <CardDescription className="font-medium text-slate-600">Tài khoản KM</CardDescription>
            <CardTitle className="!mt-0 text-lg font-bold text-yellow-600">
              {balanceData?.tk_km}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Button className="w-full">
              <LuCreditCard className="mr-2 h-4 w-4" /> Nạp tiền
            </Button>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarDashboard;
