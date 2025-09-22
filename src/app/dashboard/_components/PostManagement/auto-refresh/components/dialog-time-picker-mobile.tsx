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
import { useTimePickerLogic } from '../hooks/useTimePickerLogic';

type DialogTimePickerMobileProps = {
  isLoadingSubmit: boolean;
  handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  type: 'update' | 'add';
};

const DialogTimePickerMobile: React.FC<DialogTimePickerMobileProps> = (props) => {
  const { isLoadingSubmit, handleSubmit } = props;

  // Use the shared hook for all time picker logic
  const {
    timeRefresh,
    contentDialog,
    showDialog,
    setShowDialog,
    hours,
    minutes,
    mobileHourOptions,
    mobileMinuteOptions,
    formatTime,
    handleHourChange,
    handleMinuteChange,
    onDismissDialog,
  } = useTimePickerLogic();

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent onCloseAutoFocus={onDismissDialog} className="max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Lựa chọn thời gian</DialogTitle>
            <DialogDescription>
              <div className="space-y-6">
                {/* Current Time Display */}
                <div className="flex items-center justify-center gap-x-3 rounded-lg bg-blue-50 p-4">
                  <Image src={timeIcon} alt="time icon" width={24} height={24} />
                  <p className="text-xl font-bold text-blue-600">{formatTime(timeRefresh)}</p>
                </div>

                {/* Hour Selection */}
                <div>
                  <label className="block text-center text-sm font-medium text-gray-700 mb-3">
                    Chọn giờ
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {mobileHourOptions.map((hour) => {
                      const isSelected = hours === hour;
                      return (
                        <button
                          key={hour}
                          type="button"
                          onClick={() => handleHourChange(hour)}
                          className={`
                            h-12 rounded-lg border-2 text-lg font-semibold transition-all
                            ${isSelected
                              ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                            }
                          `}
                        >
                          {hour.toString().padStart(2, '0')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minute Selection */}
                <div>
                  <label className="block text-center text-sm font-medium text-gray-700 mb-3">
                    Chọn phút
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {mobileMinuteOptions.map((minute) => {
                      const isSelected = minutes === minute;
                      return (
                        <button
                          key={minute}
                          type="button"
                          onClick={() => handleMinuteChange(minute)}
                          className={`
                            h-14 rounded-lg border-2 text-lg font-semibold transition-all
                            ${isSelected
                              ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                            }
                          `}
                        >
                          {minute.toString().padStart(2, '0')}
                        </button>
                      );
                    })}
                  </div>
                </div>


              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              disabled={isLoadingSubmit}
              type="submit"
              className="w-full h-12 text-lg text-white"
            >
              {isLoadingSubmit && <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />}
              {isLoadingSubmit ? 'Đang tải...' : contentDialog?.buttonSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTimePickerMobile;
