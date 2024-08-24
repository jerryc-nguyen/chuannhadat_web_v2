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
import { listNavDashboard } from '@common/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { cn } from '@common/utils';
import { usePathname } from 'next/navigation';
import styles from './index.module.scss';
import Image from 'next/image';
import useAuth from '@mobile/auth/hooks/useAuth';

type SidebarDashboardProps = object;

const SidebarDashboard: React.FC<SidebarDashboardProps> = () => {
  const { currentUser } = useAuth();

  const [accordionActive, setAccordianActive] = React.useState('');
  const genKey = (index: number) => index;
  const pathname = usePathname();

  React.useEffect(() => {
    listNavDashboard.map((nav, index) => {
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
  return (
    <div
      className={cn(
        'mr-1 hidden max-h-screen w-[301px] border-r bg-muted/40 md:block',
        styles.sidebarWrapper,
      )}
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="gap-2 font-semibold">
            <Image
              src={'https://chuannhadat.com/images/logo_v2_3@2x.png'}
              alt="ic_phone"
              width={180}
              height={36}
            />
          </Link>
        </div>
        <div className="sidebar-content flex w-[300px] flex-1 flex-col overflow-y-scroll">
          <div>
            <div className="my-2 flex w-full flex-col items-center">
              <Avatar className="h-[100px] w-[100px]">
                <AvatarImage src={currentUser?.avatar_url} />
                <AvatarFallback>currentUser?.full_name</AvatarFallback>
              </Avatar>
              <b className="mt-2">{currentUser?.full_name}</b>
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
                        'whitespace-nowrap rounded-sm px-3 py-0 py-[10px] hover:no-underline',
                        isMenuActive(index) ? 'nav-active' : '',
                      )}
                    >
                      <span className="flex items-center gap-3 rounded-lg px-3 pl-0">
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
                              'whitespace-nowrap rounded-sm py-2 text-xs transition transition-all dark:hover:!bg-white dark:hover:!text-muted',
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
          </div>
          <div className="mt-auto p-4 pr-2">
            <Card className="rounded-sm p-3" x-chunk="dashboard-02-chunk-0">
              <CardHeader className="rounded-sm border p-2 text-center hover:bg-slate-50">
                <CardDescription className="text-slate-600">Tài khoản chính</CardDescription>
                <CardTitle className="font-bold text-green-600">0 Xu</CardTitle>
              </CardHeader>
              <CardHeader className="my-2 rounded-sm border p-2 text-center hover:bg-slate-50">
                <CardDescription className="text-slate-600">Tài khoản KM</CardDescription>
                <CardTitle className="font-bold text-yellow-600">30,000 Xu</CardTitle>
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
