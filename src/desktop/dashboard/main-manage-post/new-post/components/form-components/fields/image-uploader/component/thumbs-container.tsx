/* eslint-disable @typescript-eslint/no-explicit-any */

import { IUploadedImage } from '../types';
import PreviewThumb from './thumb';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

interface IThumbDragAndDropZone {
  uploadedImages: IUploadedImage[];
  onChange: (images: IUploadedImage[]) => void;
}

const ThumbDragAndDropZone: React.FC<IThumbDragAndDropZone> = ({ uploadedImages, onChange }) => {
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
      uploadedImages,
      result.source.index,
      result.destination.index
    ))
  }

  const generateKey = (image: IUploadedImage) => {
    return image.id + "";
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal" type="group">
        {(provided: any) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex w-full flex-wrap justify-start gap-5 pt-4"
          >
            {uploadedImages.map((image, index) => {
              return (
                <Draggable
                  key={generateKey(image)}
                  draggableId={generateKey(image)}
                  index={index}
                >
                  {(provided: any, snapshot: any) => (
                    <div
                      className="w-min"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      variant={snapshot.isDragging ? 'elevation' : 'outlined'}
                      elevation={4}
                    >
                      <PreviewThumb image={image} />
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
