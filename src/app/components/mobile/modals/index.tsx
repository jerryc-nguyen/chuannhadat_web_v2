import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { btsRefAtom, openModalAtom } from './states';
import {
  Sheet,
  Header,
  Content,
  Footer,
  detents,
  Portal,
} from 'react-sheet-slide';

export default function Modals() {
  const btsRef = useRef(null);
  const [modal, setModal] = useAtom(openModalAtom);
  const [_, setBtsRef] = useAtom(btsRefAtom);

  useEffect(() => {
    setBtsRef(btsRef);
  }, []);

  return (
    <Portal>
      <Sheet
        ref={btsRef}
        open={modal != undefined}
        onDismiss={() => setModal(undefined)}
        onClose={() => {
          console.log('Component unmounted');
        }}
        useDarkMode={false}
        useModal={false}
        scrollingExpands={true}
        detents={(props) => [
          detents.large(props),
          detents.medium(props),
          // detents.fit(props),
        ]}
        backdropClassName='c-btsModal__defaultBackdrop ss-sheet-backdrop'
      >
        <Header
          className='rss-header'
          scrolledClassName='rss-header-scrolled'
        >
          Title
        </Header>
        <Content className='rss-content'>
          <div style={{ padding: '54px 16px 24px' }}>
            <div>Add more storage to keep everything on online</div>
            <div>
              Online includes plenty of storage to keep all your data
              safe and features to protect your privacy.
            </div>
            <div>Learn More About Online</div>
          </div>
          <div style={{ padding: '54px 16px 24px' }}>
            <div>Add more storage to keep everything on online</div>
            <div>
              Online includes plenty of storage to keep all your data
              safe and features to protect your privacy.
            </div>
            <div>Learn More About Online</div>
          </div>
        </Content>
        <Footer className='rss-footer'>
          <button type='button' onClick={() => setModal(undefined)}>
            Close
          </button>
        </Footer>
      </Sheet>
    </Portal>
  );
}
