// Next Imports
import ServicePackageViewDesktop from "@desktop/dashboard/main-financial-management/service-package";
import { useGetUserAgentInfo } from "@hooks/useGetUserAgentInfo";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mua gói dịch vụ",
    description: "Chuẩn Nhà Đất"
}

const Page = () => {
    const { isMobile } = useGetUserAgentInfo();
  
    return (
      <>
        {isMobile ? (
          <div className="c-mobileApp">
            <ServicePackageViewDesktop />
          </div>
        ) : (
          <ServicePackageViewDesktop />
        )}
      </>
    );
  };

export default Page