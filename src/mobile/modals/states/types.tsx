import { ReactElement } from 'react';

export interface DefaultModal {
  name: String;
  title?: ReactElement | string;
  content?: ReactElement | string;
  footer?: ReactElement | string;
  btsProps?: any;
  onClosed?: () => void;
}

export type Modal = DefaultModal;
