import { FilterFieldName } from 'src/types';
import { ReactElement } from 'react';

export enum ModalNames {
  locations,
  city,
  district,
  ward,
}

export interface DefaultModal {
  name: String | ModalNames | FilterFieldName;
  title?: ReactElement | string;
  content?: ReactElement | string;
  footer?: ReactElement | string;
  maxHeightPercent?: number;
  defaultContentHeight?: number;
  closeThreshold?: number;
  btsProps?: any;
  index?: number;
  onClosed?: () => void;
}

export type Modal = DefaultModal;
