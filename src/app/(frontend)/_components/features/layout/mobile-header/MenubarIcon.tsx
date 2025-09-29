import { useAuth } from '@common/auth/AuthContext';
import { Button } from '@components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@components/ui/sheet';
import LoggedUserPanel from './LoggedUserPanel';
import React from 'react';
import { Menu } from 'lucide-react';
import AnonUserPanel from '@app/(frontend)/_components/features/layout/mobile-header/AnonUserPanel';

type MenubarIconProps = {
  isLogged: boolean;
};
const MenubarIcon: React.FC<MenubarIconProps> = ({ isLogged }) => {
  const [openMenuBar, setOpenMenuBar] = React.useState<boolean>(false);

  const { currentUser } = useAuth();

  React.useEffect(() => {
    if (!currentUser && !isLogged) {
      setOpenMenuBar(false);
    }
  }, [currentUser, isLogged]);


  return (
    <Sheet onOpenChange={setOpenMenuBar} open={openMenuBar}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenMenuBar(true)}
          className="mr-0 rounded-full !bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        {isLogged || currentUser ? (
          <LoggedUserPanel />
        ) : (
          <AnonUserPanel setOpenMenuBar={setOpenMenuBar} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MenubarIcon;
