import { useAtom } from 'jotai';
import { TPanel, sidePanelAtom } from './states';

export default function useSidePanels() {
  const [panel, setPanel] = useAtom(sidePanelAtom);

  const openPanel = (panel: TPanel) => {
    setPanel(panel);
  };

  const closePanel = () => {
    if (panel?.onClosed) {
      panel.onClosed();
    }
    setPanel(undefined);
  };

  const closePanels = () => {
    closePanel();
  };

  return {
    openPanel,
    closePanel,
    closePanels,
  };
}
