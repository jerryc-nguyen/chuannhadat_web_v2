/* eslint-disable @typescript-eslint/no-explicit-any */

import { CircleX } from 'lucide-react';
import { IUploadedImage } from '../types';
import PreviewThumb from './thumb';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useEffect, useRef } from 'react';
import { useDepositModal } from '@components/ui/DepositModal';
import { useBalanceRequest } from '@api/balance';

interface IThumbDragAndDropZone {
  images: IUploadedImage[];
  onChange: (images: IUploadedImage[]) => void;
}

const ThumbDragAndDropZone: React.FC<IThumbDragAndDropZone> = ({ images, onChange }) => {
  const { setOpenDepositModal } = useDepositModal();
  const { balanceData } = useBalanceRequest();
  const depositModalShownRef = useRef(false);

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    onChange(reorder(
      images,
      result.source.index,
      result.destination.index
    ))
  }

  const generateKey = (image: IUploadedImage) => {
    return image.id + "";
  }

  const onRemoveImageClick = (image: IUploadedImage) => {
    if (!confirm('Bạn muốn xoá hình này?')) {
      return;
    }
    onChange(images.filter((img) => img.id != image.id));
  }

  // Filter out images that have hasError set to true
  // @ts-ignore: uploadedFile is not defined in the IUploadedImage interface
  const filteredImages = images.filter(image => image.uploadedFile?.hasError !== true);

  // Filter out images that have hasError set to true
  // @ts-ignore: uploadedFile is not defined in the IUploadedImage interface
  const errorImages = images.filter(image => image.uploadedFile?.hasError === true);

  // Open deposit modal when there are error images
  useEffect(() => {
    if (errorImages.length > 0 && balanceData?.total_amount < 2000 && !depositModalShownRef.current) {
      setOpenDepositModal(true);
      depositModalShownRef.current = true;
    }
  }, [errorImages.length, setOpenDepositModal, balanceData?.total_amount]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal" type="group">
        {(provided: any) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex w-full flex-wrap justify-start gap-5 pt-4"
          >
            {filteredImages.map((image, index) => {
              return (
                <Draggable
                  key={generateKey(image)}
                  draggableId={generateKey(image)}
                  index={index}
                >
                  {(provided: any, snapshot: any) => (
                    <div
                      className="w-min relative"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      variant={snapshot.isDragging ? 'elevation' : 'outlined'}
                      elevation={4}
                    >
                      <PreviewThumb image={image} />
                      <CircleX onClick={() => onRemoveImageClick(image)} className="absolute right-1 top-1 z-10 text-[#596570] transition-opacity duration-300 group-hover:opacity-100 cursor-pointer" />
                      {index == 0 && (<span className='absolute left-1/2 transform -translate-x-1/2 bottom-4 text-white border px-1 whitespace-nowrap rounded'>Hình đại diện</span>)}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ThumbDragAndDropZone;
