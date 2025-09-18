import { atom } from 'jotai';

export const openModalDetail = atom<boolean>(false);
export const selectedPostId = atom<string>('');
export const isLoadingModal = atom<boolean>(false);
