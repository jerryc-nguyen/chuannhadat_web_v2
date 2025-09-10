import { getCookieServer } from '@app/action';
import { API_TOKEN_SERVER } from '@common/auth';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import Breadcrumb from '@components/breadcrumb';
import { SidebarTrigger } from '@components/ui/sidebar';
import MainNavRight from '@mobile/header/MainNavRight';
import AvatarIcon from '@views/components/AvatarIcon';
import FavoriteIcon from '@views/components/FavoriteIcon';
import NotificationIcon from '@views/components/NotificationIcon';
import ButtonCreatePost from './ButtonCreatePost';

type HeaderDashboardProps = object;

const HeaderDashboard: React.FC<HeaderDashboardProps> = async () => {
  const isLogged = Boolean(await getCookieServer(API_TOKEN_SERVER));
  const { isMobile } = await getUserAgentInfo();
  return (
    <header className="sticky top-0 z-20 box-border flex h-[70px] items-center justify-between gap-4 border-b bg-muted/40 bg-white px-4 py-2 lg:px-6">
      <div className="flex items-center gap-x-4">
        {isMobile && <SidebarTrigger />}
        {!isMobile && <Breadcrumb />}
      </div>

      {isMobile ? (
        <MainNavRight isLogged={isLogged} />
      ) : (
        <section className="flex items-center gap-x-2">
          <NotificationIcon isLogged={isLogged} />
          <FavoriteIcon />
          <AvatarIcon isLogged={isLogged} />
          <ButtonCreatePost />
        </section>
      )}
    </header>
  );
};

export default HeaderDashboard;
