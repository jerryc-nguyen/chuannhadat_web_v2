export interface ICommonResponse<T> {
  code: number;
  status: boolean;
  data: T;
}
export interface IReponseError {
  code: number;
  status: boolean;
}
