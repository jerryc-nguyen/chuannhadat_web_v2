import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { btsRefAtom, btsModalAtom } from './states';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import './style.css';

export default function BtsModals() {
  const btsRef = useRef(null);
  const [modal, setModal] = useAtom(btsModalAtom);
  const [_, setBtsRef] = useAtom(btsRefAtom);

  useEffect(() => {
    setBtsRef(btsRef);
  }, [setBtsRef]);

  const onClose = () => {
    if (modal?.onClosed) {
      modal.onClosed();
    }
    setModal(undefined);
  };

  return (
    <BottomSheet
      ref={btsRef}
      open={modal != undefined}
      onDismiss={() => onClose()}
      defaultSnap={({ snapPoints, lastSnap }) =>
        lastSnap ?? Math.min(...snapPoints)
      }
      snapPoints={({ maxHeight }) => [
        maxHeight - maxHeight / 5,
        maxHeight * 0.6,
      ]}
      header={modal?.title || 'Missing title'}
      footer={modal?.footer}
    >
      <div>{modal?.content || 'Missing content'}</div>
    </BottomSheet>
  );
}
