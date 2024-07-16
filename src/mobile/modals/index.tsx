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
  }, []);

  const onClose = () => {
    // if (modal?.onClosed) {
    //   modal.onClosed();
    // }
    setModal(undefined);
  };

  const footerClassName = modal?.footer ? 'rss-footer' : 'hidden';

  return (
    <BottomSheet
      blocking={false}
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
      sibling={
        <div
          data-rsbs-backdrop='true'
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClose();
          }}
        />
      }
    >
      {modal?.content || 'Missing content'}
    </BottomSheet>
  );
}
