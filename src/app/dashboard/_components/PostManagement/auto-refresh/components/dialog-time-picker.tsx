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
import { useIsMobile } from '@common/hooks/useMobile';
import { useTimePickerLogic } from '../hooks/useTimePickerLogic';
import DialogTimePickerMobile from './dialog-time-picker-mobile';

type DialogTimePickerProps = {
  isLoadingSubmit: boolean;
  handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  type: 'update' | 'add';
};

const DialogTimePicker: React.FC<DialogTimePickerProps> = (props) => {
  const { isLoadingSubmit, handleSubmit, type } = props;
  const isMobile = useIsMobile();

  // Use the shared hook for all time picker logic
  const {
    timeRefresh,
    contentDialog,
    showDialog,
    setShowDialog,
    hours,
    minutes,
    hourOptions,
    minuteOptions,
    formatTime,
    handleHourChange,
    handleMinuteChange,
    onDismissDialog,
  } = useTimePickerLogic();

  // If mobile, use the mobile-optimized component
  if (isMobile) {
    return (
      <DialogTimePickerMobile
        isLoadingSubmit={isLoadingSubmit}
        handleSubmit={handleSubmit}
        type={type}
      />
    );
  }

  // Desktop version continues below
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent onCloseAutoFocus={onDismissDialog}>
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
                    <Select value={hours.toString()} onValueChange={(value) => handleHourChange(value)}>
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
                    <Select value={minutes.toString()} onValueChange={(value) => handleMinuteChange(value)}>
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
