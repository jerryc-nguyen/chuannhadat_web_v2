/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileWithPreview } from '@app/tao-tin-moi/type';
import PreviewThumb from './thumb';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

interface IThumbDragAndDropZone {
  files: FileWithPreview[];
  setFiles: (arg0: any) => void;
}
const ThumbDragAndDropZone: React.FC<IThumbDragAndDropZone> = ({ files, setFiles }) => {

    const reorder = (list: any[], startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
      };

    function onDragEnd (result: any) {
        // dropped outside the list
        if (!result.destination) {
          return;
        }

        setFiles((prev: any) => {
            return reorder(
                prev,
                result.source.index,
                result.destination.index
            )
        })
      }
    
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided: any) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex w-full flex-wrap justify-start gap-5 pt-4"
          >
            {files.map((file, index) => {
              return (
                <Draggable key={file.name + index} draggableId={file.name + index} index={index}>
                  {(provided: any, snapshot: any) => (
                    <div
                      className="w-min"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      variant={snapshot.isDragging ? 'elevation' : 'outlined'}
                      elevation={4}
                    >
                      <PreviewThumb file={file} />
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
