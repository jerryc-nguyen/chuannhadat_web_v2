// Next Imports
import ServicePackageViewDesktop from "@views/dashboard/main-financial-management/service-package";
import ServicePackageViewMobile from "@mobile/main-financial-management/service-package";
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
            <ServicePackageViewMobile />
          </div>
        ) : (
          <ServicePackageViewDesktop />
        )}
      </>
    );
  };

export default Page