import { FilterFieldName } from '@models';
import { ReactElement } from 'react';

export enum ModalNames {
  locations,
  city,
  district,
  ward,
}

export interface DefaultModal {
  name?: string | ModalNames | FilterFieldName;
  title?: ReactElement | string;
  titleDescription?: ReactElement | string;
  content?: ReactElement | string;
  footer?: ReactElement | string;
  maxHeightPercent?: number;
  defaultContentHeight?: number;
  closeThreshold?: number;
  btsProps?: A;
  index?: number;
  desktopSize?: string;
  onClosed?: IFunction;
  showAsDialog?: boolean;
  btsContentWrapClass?: string;
  dialogContentWrapClass?: string;
  isHiddenScroll?: boolean;
  allowChildOverflow?: boolean;
  headerHeight?: number;
  footerHeight?: number;
  pushToPath?: string;
  supportPushState?: boolean;
  portalFooter?: boolean
}

export type Modal = DefaultModal;
