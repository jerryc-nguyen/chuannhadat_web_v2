import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { StatusPhoneNumber } from '@desktop/post-detail/type';
import React from 'react';
import { LuPhoneCall } from 'react-icons/lu';

type ButtonPhoneProps = {
  phoneNumberProfile: string;
  className?: string;
};

const ButtonPhone: React.FC<ButtonPhoneProps> = ({ phoneNumberProfile, className }) => {
  const [phoneNumber, setPhoneNumber] = React.useState<string>(
    phoneNumberProfile.slice(0, -4) + 'xxxx',
  );
  const [textButtonPhone, setTextButtonPhone] = React.useState<string>(StatusPhoneNumber.normal);
  const handleClickButtonPhone = async () => {
    if (textButtonPhone === StatusPhoneNumber.copy) {
      const text = document.getElementById('phone-number')?.innerHTML;
      try {
        await navigator.clipboard.writeText(text || '');
        setTextButtonPhone(StatusPhoneNumber.copied);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
    if (textButtonPhone === StatusPhoneNumber.normal) {
      setPhoneNumber(phoneNumberProfile);
      setTextButtonPhone(StatusPhoneNumber.copy);
    }
  };
  React.useEffect(() => {
    if (textButtonPhone === StatusPhoneNumber.copied) {
      setTimeout(() => {
        setTextButtonPhone(StatusPhoneNumber.copy);
      }, 2000);
    }
  }, [textButtonPhone]);
  return (
    <Button
      onClick={handleClickButtonPhone}
      className={cn(
        'flex h-fit items-center justify-center gap-x-2 bg-blue-500 text-white hover:bg-blue-400 hover:text-white',
        className,
      )}
      variant={'outline'}
    >
      <span className="flex items-center gap-x-2">
        <LuPhoneCall />
        <span id="phone-number">{phoneNumber}</span>
      </span>
      <span>{textButtonPhone}</span>
    </Button>
  );
};

export default ButtonPhone;
