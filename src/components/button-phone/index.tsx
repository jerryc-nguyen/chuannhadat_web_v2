import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { StatusPhoneNumber } from '@desktop/post-detail/type';
import React from 'react';
import { FaPhone } from 'react-icons/fa6';

type ButtonPhoneProps = {
  phoneNumberProfile: string;
  className?: string;
  isMobile?: boolean;
};

const ButtonPhone: React.FC<ButtonPhoneProps> = ({ phoneNumberProfile, className, isMobile }) => {
  const [phoneNumber, setPhoneNumber] = React.useState<string>(
    phoneNumberProfile.slice(0, -4) + 'xxxx',
  );
  const [textButtonPhone, setTextButtonPhone] = React.useState<string>(
    isMobile ? StatusPhoneNumber.copy : StatusPhoneNumber.normal,
  );
  const handleClickButtonPhone = async () => {
    if (textButtonPhone === StatusPhoneNumber.copy) {
      try {
        await navigator.clipboard.writeText(phoneNumberProfile);
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
        'flex h-fit items-center justify-center gap-x-2 bg-primary_color/80 text-white hover:bg-primary_color hover:text-white',
        className,
      )}
      variant={'outline'}
    >
      <span className="flex items-center gap-x-2">
        <FaPhone />
        <span id="phone-number">{isMobile ? textButtonPhone : phoneNumber}</span>
      </span>
      {!isMobile && <span>{textButtonPhone}</span>}
    </Button>
  );
};

export default ButtonPhone;
