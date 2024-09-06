import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { ReloadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import timeIcon from '@assets/icons/time.svg';
import React from 'react';
import { useAtom } from 'jotai';
import {
  contentDialogTimerPickerAtom,
  defaultTimeRefresh,
  showDialogTimePickerAtom,
  timeRefreshAtom,
} from '../../states/autorefreshAtoms';

type DialogTimePickerProps = {
  isLoadingSubmit: boolean;
  handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  type: 'update' | 'add';
};

const DialogTimePicker: React.FC<DialogTimePickerProps> = (props) => {
  const { isLoadingSubmit, handleSubmit } = props;
  const [timeRefresh, setTimeRefresh] = useAtom(timeRefreshAtom);
  const [contentDialog, setContentDialog] = useAtom(contentDialogTimerPickerAtom);
  const [showDialog, setShowDialog] = useAtom(showDialogTimePickerAtom);
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${hours} giờ ${minutes} phút`;
  };
  const handleChangeTimeRefresh = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeRefresh(event.target.value);
  };
  const onDissmisDialog = () => {
    setContentDialog(undefined);
    setTimeRefresh(defaultTimeRefresh);
  };
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent onCloseAutoFocus={onDissmisDialog}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="mb-2"> Lựa chọn thời gian</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-x-2">
                <div className="relative max-w-[8rem]">
                  <div className="pointer-events-none absolute inset-y-0 end-0 top-0 flex items-center pe-3.5">
                    <Image src={timeIcon} alt="ic_eyy_off" width={16} height={16} />
                  </div>
                  <input
                    type="time"
                    id="time"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    value={timeRefresh}
                    onChange={handleChangeTimeRefresh}
                    required
                  />
                </div>
                <p className="text-lg font-bold text-slate-500">{formatTime(timeRefresh)}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isLoadingSubmit} type="submit">
              {isLoadingSubmit && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              {isLoadingSubmit ? 'Đang tải...' : contentDialog?.buttonSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTimePicker;
