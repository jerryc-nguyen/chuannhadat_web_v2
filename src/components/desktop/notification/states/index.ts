import { atom } from 'jotai';
import { INotificationResponse } from '@common/types';

export const pageAtom = atom<number>(1);
export const perPageAtom = atom<number>(10);
export const totalAtom = atom<number>(0);
export const filterStatusAtom = atom<'read' | 'unread' | null>(null);

export const paginationAtom = atom(
  (get) => ({
    page: get(pageAtom),
    per_page: get(perPageAtom),
  }),
  (get, set, update: { page?: number; per_page?: number }) => {
    if (update.page !== undefined) set(pageAtom, update.page);
    if (update.per_page !== undefined) set(perPageAtom, update.per_page);
  },
);

export const notificationsDataAtom = atom<INotificationResponse[]>([]);
