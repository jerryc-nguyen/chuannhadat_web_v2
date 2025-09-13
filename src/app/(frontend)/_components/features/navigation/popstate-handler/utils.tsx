import { updateUrlSearchParams } from "@common/utils";

// use param: bts to mark there is an new virtual page / modal was openned 
// so when user hit back, we can close virtual / modal 
export const removeBrowserHistoryModalsState = (currentPushedPath?: string) => {
  if (currentPushedPath) {
    window.history.back();
  } else if (window.location.href.indexOf('bts') != -1) {
    const newUrl = updateCurrentUrlSearchParams({ bts: null });
    window.history.replaceState({ bts: null }, '', newUrl);
  }
}

export const updateCurrentUrlSearchParams = (params: Record<string, A>) => {
  const url = window.location.href;
  return updateUrlSearchParams(url, params);
}
