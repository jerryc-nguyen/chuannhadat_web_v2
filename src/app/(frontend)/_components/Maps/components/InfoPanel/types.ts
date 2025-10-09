import { StaticImageData } from 'next/image';
import { Marker } from '../../types';
import { IUser } from '@common/types';

export interface InfoPanelProps {
  marker: Marker;
  onClose: () => void;
  position?: 'left' | 'right';
  offsetLeft?: number;
}

export interface ProfileDataState {
  profileData: IUser | null;
  imgSrc: string | StaticImageData;
  setImgSrc: (src: string | StaticImageData) => void;
  isLoading: boolean;
  error: Error | null;
}

export interface InfoPanelSection {
  id: string;
  title?: string;
  component: React.ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
  showDivider?: boolean;
}

export interface UseInfoPanelOptions {
  marker: Marker;
  onClose?: () => void;
}
