/* eslint-disable @typescript-eslint/no-explicit-any */
<<<<<<< HEAD:src/desktop/dashboard/main-manage-post/new-post/components/form-components/fields/image-uploader/component/thumbs-container.tsx
import { CNDImage } from '@desktop/dashboard/main-manage-post/new-post/type';
=======
import { CNDImage } from '@app/(home)/tao-tin-moi/type';
>>>>>>> main:src/app/(home)/tao-tin-moi/components/form-components/fields/image-uploader/component/thumbs-container.tsx
import PreviewThumb from './thumb';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

interface IThumbDragAndDropZone {
  cndImages: CNDImage[];
  setFiles: (arg0: any) => void;
}
const ThumbDragAndDropZone: React.FC<IThumbDragAndDropZone> = ({ cndImages, setFiles }) => {
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

    setFiles((prev: any) => {
      return reorder(prev, result.source.index, result.destination.index);
    });
  }

  const generateKey = (cndImage: CNDImage) => {
    return cndImage.id
      ? cndImage.id.toString()
      : cndImage.uploadedFile
        ? cndImage.uploadedFile.name
        : '';
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided: any) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex w-full flex-wrap justify-start gap-5 pt-4"
          >
            {cndImages.map((cndImage, index) => {
              return (
                <Draggable
                  key={generateKey(cndImage)}
                  draggableId={generateKey(cndImage)}
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
                      <PreviewThumb image={cndImage} />
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
