import { ReactElement } from 'react';
import { SheetProps } from 'react-sheet-slide';

export interface DefaultModal {
  name: String;
  title?: ReactElement | string;
  content?: ReactElement | string;
  footer?: ReactElement | string;
  snapPoints?: Array<string> | Array<number>;
  btsProps?: SheetProps;
}

export type Modal = DefaultModal;
