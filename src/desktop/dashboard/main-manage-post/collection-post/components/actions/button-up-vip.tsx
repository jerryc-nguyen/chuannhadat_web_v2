'use client';
import { Button } from '@components/ui/button';
import useModals from '@mobile/modals/hooks';
import { ChevronsUp } from 'lucide-react';
import UpVipProductForm from '../up-vip-form';

export const ButtonUpVip = ({ productId, adsType }: { productId: string; adsType: string }) => {
  const { openModal, closeModal } = useModals();

  const showModalUpVipProduct = () => {
    openModal({
      name: 'ModalUpVipProduct',
      title: 'Cấu hình tin đăng',
      content: <UpVipProductForm productId={productId} closeModal={closeModal} />,
      footer: <></>,
      showAsDialog: true,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8"
      onClick={() => {
        showModalUpVipProduct();
      }}
      disabled={adsType !== 'normal'}
    >
      <ChevronsUp color="#28a745" size={16} />
      <span className="text-sm text-[#28a745]">UP VIP</span>
      <ChevronsUp color="#28a745" size={16} />
    </Button>
  );
};
