import { ReactElement } from 'react';

export enum ModalNames {
  locations,
}
export interface DefaultModal {
  name: String | ModalNames;
  title?: ReactElement | string;
  content?: ReactElement | string;
  footer?: ReactElement | string;
  maxHeightPercent?: number;
  defaultContentHeight?: number;
  closeThreshold?: number;
  btsProps?: any;
  onClosed?: () => void;
}

export type Modal = DefaultModal;
