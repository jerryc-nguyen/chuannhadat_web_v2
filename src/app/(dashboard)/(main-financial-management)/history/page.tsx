// Next Imports
import type { Metadata } from "next";
import { Provider as JotaiProvider } from "jotai";
import { getUserAgentInfo } from "@utils/ssrUserAgent";
import HistoryView from "@mobile/main-financial-management/history";

export const metadata: Metadata = {
  title: "Lịch sử nạp tiền",
  description: "Chuẩn Nhà Đất",
};

const Page = () => {
  const { isMobile } = getUserAgentInfo();

  return (
    <JotaiProvider>
      {isMobile ? (
        <div className="c-mobileApp">
          <HistoryView />
        </div>
      ) : (
        <HistoryView />
      )}
    </JotaiProvider>
  );
};

export default Page;
