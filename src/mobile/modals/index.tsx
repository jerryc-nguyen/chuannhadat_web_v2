import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { btsRefAtom, btsModalAtom } from './states';
import {
  Sheet,
  Header,
  Content,
  Footer,
  detents,
  Portal,
} from 'react-sheet-slide';

export default function BtsModals() {
  const btsRef = useRef(null);
  const [modal, setModal] = useAtom(btsModalAtom);
  const [_, setBtsRef] = useAtom(btsRefAtom);

  useEffect(() => {
    setBtsRef(btsRef);
  }, []);

  const onClose = () => {
    if (modal?.onAfterClose) {
      modal.onAfterClose();
    }
    setModal(undefined);
  };

  const footerClassName = modal?.footer ? 'rss-footer' : 'hidden';

  return (
    <Portal>
      <Sheet
        ref={btsRef}
        open={modal != undefined}
        onDismiss={() => onClose()}
        useDarkMode={false}
        useModal={false}
        scrollingExpands={false}
        detents={(props) => [
          detents.large(props),
          detents.medium(props),
        ]}
        backdropClassName='c-btsModal__defaultBackdrop ss-sheet-backdrop'
      >
        <Header
          className='rss-header'
          scrolledClassName='rss-header-scrolled'
        >
          {modal?.title || 'Missing title'}
        </Header>
        <Content className='rss-content'>
          <div style={{ paddingTop: '54px' }}>
            {modal?.content || 'Missing content'}
          </div>
        </Content>

        <Footer className={footerClassName}>{modal?.footer}</Footer>
      </Sheet>
    </Portal>
  );
}
