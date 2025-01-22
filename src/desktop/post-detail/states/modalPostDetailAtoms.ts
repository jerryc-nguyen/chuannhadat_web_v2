import { atom } from 'jotai';

export const openModalDetail = atom<boolean>(true);
export const selectedPostId = atom<string>('');
export const isLoadingModal = atom<boolean>(false);
