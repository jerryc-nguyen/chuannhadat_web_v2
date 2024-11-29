import React from 'react';

export interface ICommonAlertDialogProps {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  alertTrigger?: () => React.ReactNode;
  title: string | JSX.Element;
  description: string | React.ReactNode;
  onRenderFooter?: React.ReactNode;
  handleCancel?: () => void;
  handleContinue?: () => void;
  textButtonLeft?: string;
  textButtonRight?: string;
}
