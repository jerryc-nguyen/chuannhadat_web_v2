import { ReactElement } from 'react';

export interface DefaultModal {
  name: String;
  content?: ReactElement;
  footer?: ReactElement;
  snapPoints?: Array<string> | Array<number>;
}

export type Modal = DefaultModal;
