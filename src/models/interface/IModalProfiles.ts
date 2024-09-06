import { CustomerGender, CustomerType } from '@models/enums';

export interface IModalUpdatePassoword {
  current_password?: string;
  new_password: string;
  confirm_password: string;
}
export interface IModalUpdateProfile {
  role?: CustomerType;
  full_name: string;
  job_title?: string;
  exp_years?: number;
  address?: string;
  gender?: CustomerGender;
  description?: string;
  facebook_url?: string;
  website_url?: string;
  youtube_url?: string;
}
