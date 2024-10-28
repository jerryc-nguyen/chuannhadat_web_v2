'use client';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LuCreditCard } from 'react-icons/lu';
import { cn } from '@common/utils';
import { usePathname } from 'next/navigation';
import styles from '../styles/sidebar.module.scss';
import useAuth from '@mobile/auth/hooks/useAuth';
import { useBalanceRequest } from '@api/balance';
import { listNavDashboard } from '../constants';
import Logo from '@components/logo';
import Image from 'next/image';
import { Skeleton } from '@components/ui/skeleton';

const SidebarDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  const [accordionActive, setAccordianActive] = React.useState('');
  const genKey = (index: number) => index;
  const pathname = usePathname();

  const { balanceData, fetchBalance } = useBalanceRequest();

  React.useEffect(() => {
    listNavDashboard.forEach((nav, index) => {
      if (nav?.links) {
        const listNavLink = nav?.links.map((item) => item.url);
        if (listNavLink.some((navLink) => pathname.includes(navLink))) {
          setAccordianActive(`item${index}`);
        }
      }
    });
  }, [pathname]);

  const getActiveLink = (url: string) => {
    return pathname.includes(url) ? 'nav-link_active' : '';
  };
  const isMenuActive = (index: number) => {
    return accordionActive === `item${index}`;
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
    <div
      className={cn(
        'hidden max-h-screen w-[301px] border-r bg-muted/40 md:block',
        styles.sidebarWrapper,
      )}
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="box-content flex h-16 items-center justify-center border-b bg-white/30 px-4 py-2 backdrop-blur-md lg:px-6">
          <Logo />
        </div>
        <div className="sidebar-content flex w-[300px] flex-1 flex-col overflow-y-scroll">
          <div className="my-2 flex w-full flex-col items-center">
            {currentUser?.avatar_url ? (
              <Image
                width={100}
                height={100}
                src={currentUser?.avatar_url || ''}
                alt="avatar_image"
                className="h-[100px] w-[100px] rounded-full bg-slate-300"
              />
            ) : (
              <Skeleton className="h-[100px] w-[100px] rounded-full" />
            )}

            {currentUser?.full_name ? (
              <b className="mt-2">{currentUser?.full_name}</b>
            ) : (
              <Skeleton className="mt-2 h-6 w-[120px]" />
            )}
          </div>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Accordion value={accordionActive} type="single" collapsible>
              {listNavDashboard.map((nav, index) => (
                <AccordionItem
                  key={genKey(index)}
                  value={`item${index}`}
                  className="mb-2 justify-between border-none"
                >
                  <AccordionTrigger
                    onClick={() =>
                      setAccordianActive((state) =>
                        state === `item${index}` ? '' : `item${index}`,
                      )
                    }
                    className={cn(
                      'whitespace-nowrap rounded-sm px-3 py-[10px] hover:no-underline',
                      isMenuActive(index) ? 'nav-active' : '',
                    )}
                  >
                    <span className="flex items-center gap-3 rounded-lg px-3 pl-0 text-lg">
                      <nav.icon className="h-5 w-5" />
                      {nav.name}
                    </span>
                  </AccordionTrigger>
                  <div className="sub-menu">
                    <AccordionContent className="sub-menu_list">
                      {nav.links?.map((navLink, index) => (
                        <Link
                          key={genKey(index)}
                          href={`/dashboard/${navLink.url}`}
                          className={cn(
                            'whitespace-nowrap rounded-sm py-2 text-base transition-all dark:hover:!bg-white dark:hover:!text-muted',
                            getActiveLink(navLink.url),
                          )}
                        >
                          {navLink.name}
                        </Link>
                      ))}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>

          <div className="mt-auto p-4 pr-2">
            <Card className="rounded-sm p-3" x-chunk="dashboard-02-chunk-0">
              <CardHeader className="rounded-sm border p-2 text-center hover:bg-slate-50">
                <CardDescription className="text-slate-600">Tài khoản chính</CardDescription>
                <CardTitle className="font-bold text-green-600">{balanceData?.tk_chinh}</CardTitle>
              </CardHeader>
              <CardHeader className="my-2 rounded-sm border p-2 text-center hover:bg-slate-50">
                <CardDescription className="text-slate-600">Tài khoản KM</CardDescription>
                <CardTitle className="font-bold text-yellow-600">{balanceData?.tk_km}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Button className="w-full">
                  <LuCreditCard className="mr-2 h-4 w-4" /> Nạp tiền
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarDashboard;
