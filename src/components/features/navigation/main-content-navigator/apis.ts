import axiosInstance from "@common/api/axiosInstance";
import { removeEmpty } from "@common/utils";

export async function navigatorApi(params: Record<string, A>): Promise<A> {
  return axiosInstance.post('/api/v1/searchs/navigator', removeEmpty(params));
}
