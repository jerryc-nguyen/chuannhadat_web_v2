import { Button, Preloader } from "konsta/react";
import useModals from "@mobile/modals/hooks";
import useFilterState from "./hooks/useFilterState";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@api/searchApi";

export default function FooterOverviewBtsButton() {
  const { closeModals } = useModals();
  const { applyAllFilters, buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams();

  const { isLoading, data } = useQuery({
    queryKey: ["searchs", filterParams],
    queryFn: async () => {
      const response = await searchApi(filterParams);
      return response;
      // return await response.json();
    },
  });

  console.log("isLoading", isLoading, data);

  const onApplyFilter = () => {
    applyAllFilters();

    closeModals();
  };

  return (
    <Button onClick={onApplyFilter}>
      Xem {data?.pagination?.total_count}
      {isLoading && <Preloader className="text-white small" size="w-5 h-5" />}
    </Button>
  );
}
