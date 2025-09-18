import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { StatusPhoneNumber } from '@frontend/PostDetail/type';
import { Copy, CopyCheck } from 'lucide-react';
import React from 'react';
import { Phone as FaPhone } from 'lucide-react';
import { toast } from 'sonner';

type ButtonPhoneProps = {
  phoneNumberProfile: string;
  className?: string;
  isMobile?: boolean;
  isCall?: boolean;
};

const ButtonPhone: React.FC<ButtonPhoneProps> = ({ phoneNumberProfile, className, isMobile, isCall }) => {
  const [phoneNumber, setPhoneNumber] = React.useState<string>(phoneNumberProfile);
  const [textButtonPhone, setTextButtonPhone] = React.useState<string>(
    isMobile ? StatusPhoneNumber.copy : StatusPhoneNumber.copy,
  );
  const handleClickButtonPhone = () => {
    if (textButtonPhone === StatusPhoneNumber.copy) {
      try {
        navigator.clipboard.writeText(phoneNumberProfile);
        setTextButtonPhone(StatusPhoneNumber.copied);

        if (isCall) {
          window.location.href = `tel:${phoneNumber}`;
        }
        toast.success('Đã sao chép số điện thoại');
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
      <span className="flex items-center gap-x-2 text-xl">
        <FaPhone />
        <span id="phone-number">{isMobile ? textButtonPhone : phoneNumber}</span>
      </span>
      {!isMobile && <span>{textButtonPhone === 'Sao chép' ? <Copy /> : <CopyCheck />}</span>}
    </Button>
  );
};

export default ButtonPhone;
