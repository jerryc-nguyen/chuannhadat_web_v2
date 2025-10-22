import { OptionForSelect, IUser } from '@common/types';
import { IPagination } from '@common/types/api';
import { Marker, TMapSetting } from '../../types';

// Union type for the data that can be passed to ListingPanel
export type ListingDataType = IUser | TMapSetting;

// Extended OptionForSelect with typed data
export interface ListingOptionForSelect extends Omit<OptionForSelect, 'data'> {
  data: ListingDataType;
  data_type: 'User' | 'MapSetting';
}

export interface ListingPanelProps {
  listingOption: ListingOptionForSelect;
  onClose: () => void;
  onMarkerClick?: (marker: Marker) => void;
  visible?: boolean;
}

// Base props for both ForLocation and ForUser components
export interface BaseListingProps {
  onClose: () => void;
  onMarkerClick?: (marker: Marker) => void;
  onDataReceived?: (title: string, totalCount: number) => void;
}

// Props specific to ForLocation component
export interface ForLocationProps extends BaseListingProps {
  listingOption: ListingOptionForSelect;
}

// Props specific to ForUser component  
export interface ForUserProps extends BaseListingProps {
  listingOption: ListingOptionForSelect & { data_type: 'User'; data: IUser };
}

// Type guards for runtime type checking
export const isLocationOption = (
  option: ListingOptionForSelect
): option is ListingOptionForSelect & { data_type: 'MapSetting'; data: TMapSetting } => {
  return option?.data_type === 'MapSetting';
};

export const isUserOption = (
  option: ListingOptionForSelect
): option is ListingOptionForSelect & { data_type: 'User'; data: IUser } => {
  return option.data_type === 'User';
};

// API returns direct object with pagination and results (not wrapped in IResponseListData)
export interface LocationListingResponse {
  pagination: IPagination;
  results: Marker[];
}

export interface ListingItemsParams {
  user_uid?: string;
  location_uid?: string;
  page?: number;
  per_page?: number;
  onDataReceived?: (title: string, totalCount: number) => void;
  [key: string]: any;
}
