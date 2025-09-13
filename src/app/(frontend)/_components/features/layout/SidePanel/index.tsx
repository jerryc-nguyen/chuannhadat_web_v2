import { Sheet, SheetContent } from '@components/ui/sheet';
import { useAtom } from 'jotai';
import { sidePanelAtom } from './states';

export default function SidePanel() {
  const [panel, setSidePanel] = useAtom(sidePanelAtom);

  const onClose = () => {
    if (panel?.onClosed) {
      panel.onClosed();
    }

    setSidePanel(undefined);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Sheet open={panel != undefined} onOpenChange={onOpenChange}>
      <SheetContent side={panel?.side ?? 'right'} className="flex flex-col">
        {panel?.content}
      </SheetContent>
    </Sheet>
  );
}
