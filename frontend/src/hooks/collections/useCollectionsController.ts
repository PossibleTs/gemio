import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import services from '@app/services';
import useFetch from '../useFetch';
import { CollectionDto } from '@app/types/Collection';
import useSearch from '../useSearch';
import usePagination from '../pagination/usePagination';
import { processTableData } from '@app/utils/processTableData';
import useResetPageWhenPageLimitChanges from '@app/utils/resetPageWhenPageLimitChanges';

const useCollectionsController = () => {
  const [totalPages, setTotalPages] = useState(1);

  const { searchFilters, handleSearchFilters } = useSearch();

  const router = useRouter();

  const { data, fetchData, isLoading } = useFetch<CollectionDto[]>({
    request: { get: services.collections.fetchAll },
  });

  const handleDetail = (id: string | number) =>
    router.push(`/admin/collections/${id}`);

  const pagination = usePagination({
    totalPages: totalPages,
    order: "tokenId",
    direction: "asc"
  });

  const tableData = processTableData(data, searchFilters, {
    ...pagination,
    order: pagination.order as keyof CollectionDto
  });

  useResetPageWhenPageLimitChanges(pagination);

  useEffect(() => {
    if (tableData) {
      setTotalPages(tableData.totalPages)
    }
  }, [tableData, setTotalPages]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    handleDetail,
    pagination,
    handleSearchFilters,
    tableData
  };
};

export default useCollectionsController;
