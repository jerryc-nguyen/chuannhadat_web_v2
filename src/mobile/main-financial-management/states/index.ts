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
}

export interface ITransactionResponse {
  id: number;
  code: number;
  account_type: string;
  formatted_amount: string;
  description: string;
  created_at: string;
}
