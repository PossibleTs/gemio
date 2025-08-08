import { useEffect, useState } from "react";
import useFetch from "../useFetch";
import { AssetDto } from "@app/types/Asset";
import services from "@app/services";
import usePagination from "../pagination/usePagination";
import { processTableData } from "@app/utils/processTableData";
import useResetPageWhenPageLimitChanges from "@app/utils/resetPageWhenPageLimitChanges";
import useSearch from "../useSearch";

const useAssetsController = () => {
  const [totalPages, setTotalPages] = useState(1);

  const { searchFilters, handleSearchFilters } = useSearch();

  const { data, fetchData, isLoading } = useFetch<AssetDto[]>({
    request: { get: services.assets.fetchAll },
  });

  const pagination = usePagination({
    totalPages: totalPages,
    order: "tokenId",
    direction: "asc"
  });

  const baseTableData = processTableData(data, searchFilters, {
    ...pagination,
    order: pagination.order as keyof AssetDto
  });

  const tableData = baseTableData.list.map(item => ({
    ...item,
    format_nft_serial: {
      ass_nft_serial: item.ass_nft_serial,
      col_hedera_token_id: item.col_collection.col_hedera_token_id,
    },
  }));

  useResetPageWhenPageLimitChanges(pagination);

  useEffect(() => {
    if (baseTableData) {
      setTotalPages(baseTableData.totalPages)
    }
  }, [baseTableData, setTotalPages]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    isLoading,
    pagination,
    handleSearchFilters,
    tableData,
    fetchData
  };
};

export default useAssetsController;