import { FilterFieldName } from '@models';
import { ReactElement } from 'react';

export enum ModalNames {
  locations,
  city,
  district,
  ward,
}

export interface DefaultModal {
  name: string | ModalNames | FilterFieldName;
  title?: ReactElement | string;
  content?: ReactElement | string;
  footer?: ReactElement | string;
  maxHeightPercent?: number;
  defaultContentHeight?: number;
  closeThreshold?: number;
  btsProps?: A;
  index?: number;
  onClosed?: IFunction;
}

export type Modal = DefaultModal;
