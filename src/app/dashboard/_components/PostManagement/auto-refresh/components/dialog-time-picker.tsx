import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
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
} from '../states/autorefreshAtoms';

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

  // Parse current time value
  const [hours, minutes] = timeRefresh.split(':').map(Number);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${hours} giờ ${minutes} phút`;
  };

  // Generate hour and minute options
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  const handleHourChange = (value: string) => {
    const newTime = `${value.padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setTimeRefresh(newTime);
  };

  const handleMinuteChange = (value: string) => {
    const newTime = `${hours.toString().padStart(2, '0')}:${value.padStart(2, '0')}`;
    setTimeRefresh(newTime);
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
              <div className="space-y-4">
                <div className="flex items-center gap-x-3">
                  <Image src={timeIcon} alt="time icon" width={20} height={20} />
                  <p className="text-lg font-bold text-secondary">{formatTime(timeRefresh)}</p>
                </div>

                <div className="flex items-center gap-x-3">
                  {/* Hour Selector */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ
                    </label>
                    <Select value={hours.toString()} onValueChange={handleHourChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {hourOptions.map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-xl font-bold text-gray-400 mt-6">:</div>

                  {/* Minute Selector */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phút
                    </label>
                    <Select value={minutes.toString()} onValueChange={handleMinuteChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn phút" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {minuteOptions.map((minute) => (
                          <SelectItem key={minute} value={minute.toString()}>
                            {minute.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
