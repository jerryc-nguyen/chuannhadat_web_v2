import { ReactElement } from 'react';
import { SheetProps } from 'react-sheet-slide';

export interface DefaultModal {
  name: String;
  title?: ReactElement | string;
  content?: ReactElement | string;
  footer?: ReactElement | string;
  btsProps?: SheetProps;
}

export type Modal = DefaultModal;
