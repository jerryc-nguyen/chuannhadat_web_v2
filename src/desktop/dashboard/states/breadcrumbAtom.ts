import { atom } from 'jotai';
export interface IBreadcrumbItem {
  title: string;
  link: string;
  isActive?: boolean;
}
export const defaultBreadcrumb = [
  {
    title: 'Dashboard',
    link: '/dashboard',
  },
];
export const breadcrumbAtom = atom<IBreadcrumbItem[]>(defaultBreadcrumb);
