// Next Imports
import type { Metadata } from "next";
import { Provider as JotaiProvider } from "jotai";
import { getUserAgentInfo } from "@utils/ssrUserAgent";
import BalanceView from "@mobile/main-financial-management/balance";

export const metadata: Metadata = {
  title: "Thông tin số dư",
  description: "Chuẩn Nhà Đất",
};

const Page = () => {
  const { isMobile } = getUserAgentInfo();

  return (
    <JotaiProvider>
      {isMobile ? (
        <div className="c-mobileApp">
          <BalanceView />
        </div>
      ) : (
        <BalanceView />
      )}
    </JotaiProvider>
  );
};

export default Page;
