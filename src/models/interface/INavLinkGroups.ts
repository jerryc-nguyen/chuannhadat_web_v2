import { IconType } from 'react-icons/lib';

export interface INavLinkGroup {
  name?: string;
  links?: INavLink[];
  url?: string;
  isExpanded?: boolean;
  icon: IconType;
}
export interface INavLink {
  name: string;
  url: string;
  key?: string;
  links?: INavLink[];
  disabled?: boolean;
}
