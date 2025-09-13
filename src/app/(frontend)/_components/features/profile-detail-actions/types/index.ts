import { IResponseData } from "@common/types";

/**
 * Request callback content
 */
export interface IRequestCallbackContent {
  content: string;
  email: string;
  formatted_created_at: string;
  full_name: string;
  id: number;
  phone: string;
}

/**
 * Request callback response
 */
export type IRequestCallbackResponse = IResponseData<any>;


/**
 * List of request callbacks response
 */
export interface IListRequestResponse {
  code: number;
  status: boolean | number;
  message?: string;
  data: IRequestCallbackContent[];
}

/**
 * Request callback payload
 */
export interface IRequestCallbackPayload {
  product_uid: string;
  phone: string;
  full_name: string;
  email?: string;
  content?: string;
}
