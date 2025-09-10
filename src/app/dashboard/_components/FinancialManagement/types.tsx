export interface IFormResponse<T> {
  code: number;
  data: T;
  status: boolean | number;
  message: string;
}

export interface IBalanceResponse {
  tk_chinh: string;
  tk_km: string;
  total: string;
  total_amount: number;
}

export interface ITransactionResponse {
  id: number;
  code: number;
  account_type: string;
  formatted_amount: string;
  description: string;
  created_at: string;
}

export interface ServiceContent {
  text: string;
  value: number;
}

export interface BuyInfo {
  total: number;
  discount: number;
  formatted_total: string;
}

export interface Service {
  plan_id: number;
  plan_name: string;
  image_url: string;
  contents: ServiceContent[];
  buy_info: BuyInfo;
}

export interface ServicePackageInfo {
  sub_title: string;
  title: string;
  plans: Service[];
  type: string
}
