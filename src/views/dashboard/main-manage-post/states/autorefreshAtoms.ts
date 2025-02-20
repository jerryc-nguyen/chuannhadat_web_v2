import { atom } from 'jotai';
export interface IContentDialogTimePicker {
  type?: 'add' | 'update';
  buttonSubmit?: 'Thêm' | 'Cập nhật';
}
export const defaultTimeRefresh = '00:00';
export const timeRefreshAtom = atom<string>(defaultTimeRefresh);
export const showDialogTimePickerAtom = atom<boolean>(false);
export const contentDialogTimerPickerAtom = atom<IContentDialogTimePicker | undefined>(undefined);
