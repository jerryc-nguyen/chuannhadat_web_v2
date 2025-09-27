'use client';

import { Button } from '@components/ui/button';
import {
  SheetDescription,
  SheetTitle,
} from '@components/ui/sheet';
import { UserCircle, LogIn, UserPlus, Home, DollarSign, Key } from 'lucide-react';
import ModalSelectRegisterOrLogin from '@app/(frontend)/_components/features/auth/mobile/ModalSelectRegisterOrLogin';
import useModals from '@app/(frontend)/_components/features/layout/mobile-modals/hooks';

interface AnonUserPanelProps {
  setOpenMenuBar: (open: boolean) => void;
}

const AnonUserPanel: React.FC<AnonUserPanelProps> = ({ setOpenMenuBar }) => {
  const { openModal, closeModal } = useModals();

  const showModalLoginAndRegister = (defaultTab: 'login' | 'register' = 'login') => {
    setOpenMenuBar(false);
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin onClose={closeModal} defaultTab={defaultTab} />,
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
      btsContentWrapClass: 'mt-2 bg-white p-4',
    });
  };

  const guestMenuItems = [
    {
      id: 1,
      href: '/',
      title: 'Trang chủ',
      icon: Home,
    },
    {
      id: 2,
      href: '/category/ban-nha-hem-nha-rieng',
      title: 'Mua nhà',
      icon: DollarSign,
    },
    {
      id: 3,
      href: '/category/cho-thue-nha-hem-nha-rieng',
      title: 'Thuê nhà',
      icon: Key,
    },
  ];

  return (
    <section className="flex flex-col h-full">
      {/* Header Section */}
      <div className="flex flex-col p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center gap-x-3 mb-3">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <UserCircle className="h-8 w-8 text-gray-600" />
          </div>
          <div>
            <SheetTitle className="text-lg font-semibold text-gray-800">
              Xin chào, quý khách
            </SheetTitle>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-3 border-b">
        <Button
          className="flex w-full items-center justify-center gap-x-2 h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-sm"
          onClick={() => showModalLoginAndRegister('login')}
        >
          <LogIn className="h-4 w-4" />
          Đăng nhập
        </Button>
        <Button
          variant="outline"
          className="flex w-full items-center justify-center gap-x-2 h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium rounded-lg transition-colors"
          onClick={() => showModalLoginAndRegister('register')}
        >
          <UserPlus className="h-4 w-4" />
          Đăng ký
        </Button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1">
        <ul className="py-2">
          {guestMenuItems.map((menu) => (
            <li key={menu.id}>
              <a
                href={menu.href}
                className="flex items-center gap-x-3 px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100 last:border-b-0"
              >
                <menu.icon className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{menu.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Message */}
      <div className="p-6 bg-gray-50 border-t">
        <div className="text-center">
          <SheetDescription className="text-sm text-gray-600 leading-relaxed">
            Đăng nhập để trải nghiệm đầy đủ các tính năng và dịch vụ của chúng tôi
          </SheetDescription>
        </div>
      </div>
    </section>
  );
};

export default AnonUserPanel;
