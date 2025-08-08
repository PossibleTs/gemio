import { useEffect, useState } from "react";
import services from "@app/services";
import useFetch from "../useFetch";
import { processTableData } from "@app/utils/processTableData";
import usePagination from "../pagination/usePagination";
import useSearch from "../useSearch";
import useResetPageWhenPageLimitChanges from "@app/utils/resetPageWhenPageLimitChanges";
import { MessagesDto } from "@app/types/Message";

const useBaseAssetsDetailController = (ass_id: number) => {
  const [totalPages, setTotalPages] = useState(1);

  const { searchFilters, handleSearchFilters } = useSearch();

  const { fetchData, data, isLoading: isLoading } = useFetch<MessagesDto[]>({
    request: {
      get: services.assets.fetchMessages,
    },
  });

  const pagination = usePagination({
    totalPages: totalPages,
    order: "ame_id",
    direction: "asc"
  });


  useResetPageWhenPageLimitChanges(pagination);

  const TableData = processTableData(data, searchFilters, {
    ...pagination,
    order: pagination.order as keyof MessagesDto
  });

  const hashscanLink = (id: number) => {
    const getMessage = data.filter((item) => item.ame_id === id)
    
    window.open(`
      ${process.env.NEXT_PUBLIC_HASHSCAN_URL}transaction/${getMessage[0].ame_transaction_id}`, 
    '_blank');
  }

  useEffect(() => {
    if (TableData) {
      setTotalPages(TableData.totalPages)
    }
  }, [TableData, setTotalPages]);

  useEffect(() => {
    fetchData({ ass_id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    TableData,
    pagination,
    handleSearchFilters,
    fetchData,
    ass_id,
    hashscanLink
  };
};

export default useBaseAssetsDetailController;