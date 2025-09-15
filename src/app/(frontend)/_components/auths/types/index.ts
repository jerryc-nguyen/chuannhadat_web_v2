import { IResponseData } from "@common/types";

/**
 * Verify phone response data
 */
export interface IVerifyPhoneResponseData {
  name: string;
  avatar: string;
  email?: string;
}


/**
 * Verify phone response
 */
export type IVerifyPhoneResponse = IResponseData<IVerifyPhoneResponseData>;
