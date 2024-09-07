import { atom } from 'jotai';
export interface IBreadcrumbItem {
  title: string;
  link: string;
  isActive?: boolean;
}
export const breadcrumbAtom = atom<IBreadcrumbItem[]>([
  {
    title: 'Dashboard',
    link: '/dashboard',
  },
]);
