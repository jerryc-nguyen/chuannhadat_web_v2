import { privateAxios } from "./base";

import { removeEmpty } from "@utils/hash";

export async function searchApi(params = {}): Promise<any> {
  return privateAxios.get("/api/v1/searchs", { params: removeEmpty(params) });
}

export async function toParamsApi(params = {}): Promise<any> {
  return privateAxios.get("/api/v1/searchs/to_params", {
    params: removeEmpty(params),
  });
}
