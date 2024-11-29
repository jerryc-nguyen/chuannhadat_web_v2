import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@components/ui/alert-dialog';
import { ICommonAlertDialogProps } from './AlertDialog.type';

const CommonAlertDialog: React.FC<ICommonAlertDialogProps> = (props) => {
  const {
    alertTrigger,
    title,
    description,
    onRenderFooter,
    handleCancel,
    handleContinue,
    handleOpenChange,
    isOpen,
    textButtonLeft,
    textButtonRight,
  } = props;
  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger>{alertTrigger && alertTrigger()}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onRenderFooter ? (
            onRenderFooter
          ) : (
            <>
              {textButtonLeft && (
                <AlertDialogCancel onClick={handleCancel}>{textButtonLeft}</AlertDialogCancel>
              )}
              {textButtonRight && (
                <AlertDialogAction onClick={handleContinue}>{textButtonRight}</AlertDialogAction>
              )}
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default CommonAlertDialog;
