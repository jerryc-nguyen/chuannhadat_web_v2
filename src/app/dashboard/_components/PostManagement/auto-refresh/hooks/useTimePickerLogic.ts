import { useAtom } from 'jotai';
import {
  contentDialogTimerPickerAtom,
  defaultTimeRefresh,
  showDialogTimePickerAtom,
  timeRefreshAtom,
} from '../states/autorefreshAtoms';

export const useTimePickerLogic = () => {
  const [timeRefresh, setTimeRefresh] = useAtom(timeRefreshAtom);
  const [contentDialog, setContentDialog] = useAtom(contentDialogTimerPickerAtom);
  const [showDialog, setShowDialog] = useAtom(showDialogTimePickerAtom);

  // Parse current time value
  const [hours, minutes] = timeRefresh.split(':').map(Number);

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${hours} giờ ${minutes} phút`;
  };

  // Generate options
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  const mobileHourOptions = Array.from({ length: 14 }, (_, i) => i + 7); // 7-20 (7 AM to 8 PM)
  const mobileMinuteOptions = [0, 15, 30, 45]; // Common intervals for mobile

  // If current hour is not in mobile options, add it
  const currentHourInOptions = mobileHourOptions.includes(hours);
  const adjustedMobileHourOptions = currentHourInOptions
    ? mobileHourOptions
    : [...mobileHourOptions, hours].sort((a, b) => a - b);

  // If current minute is not in mobile options, add it
  const currentMinuteInOptions = mobileMinuteOptions.includes(minutes);
  const adjustedMobileMinuteOptions = currentMinuteInOptions
    ? mobileMinuteOptions
    : [...mobileMinuteOptions, minutes].sort((a, b) => a - b);

  // Handle time changes
  const handleHourChange = (hour: number | string) => {
    const hourValue = typeof hour === 'string' ? parseInt(hour) : hour;
    const newTime = `${hourValue.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setTimeRefresh(newTime);
  };

  const handleMinuteChange = (minute: number | string) => {
    const minuteValue = typeof minute === 'string' ? parseInt(minute) : minute;
    const newTime = `${hours.toString().padStart(2, '0')}:${minuteValue.toString().padStart(2, '0')}`;
    setTimeRefresh(newTime);
  };

  // Handle dialog dismiss
  const onDismissDialog = () => {
    setContentDialog(undefined);
    setTimeRefresh(defaultTimeRefresh);
  };

  // Quick presets for mobile
  const quickPresets = [
    { label: '8:00 AM', value: '08:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '6:00 PM', value: '18:00' },
    { label: '9:00 PM', value: '21:00' },
  ];

  return {
    // State
    timeRefresh,
    setTimeRefresh,
    contentDialog,
    showDialog,
    setShowDialog,
    hours,
    minutes,

    // Options
    hourOptions,
    minuteOptions,
    mobileHourOptions: adjustedMobileHourOptions,
    mobileMinuteOptions: adjustedMobileMinuteOptions,
    quickPresets,

    // Functions
    formatTime,
    handleHourChange,
    handleMinuteChange,
    onDismissDialog,
  };
};
