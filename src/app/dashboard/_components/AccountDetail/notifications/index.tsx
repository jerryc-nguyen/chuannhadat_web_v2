import { getUserAgentInfo } from '@common/getUserAgentInfo';
import NotificationsDesktop from './NotificationsDesktop';
import NotificationsMobile from './mobile';

interface NotificationsProps {
  isMobile?: boolean;
}

export default async function Notifications({ isMobile }: NotificationsProps) {
  // If isMobile is not provided, detect it
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? <NotificationsMobile /> : <NotificationsDesktop />;
}
