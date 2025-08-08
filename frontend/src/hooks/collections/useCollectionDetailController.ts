import { useEffect, useState } from 'react';
import services from '@app/services';
import useFetch from '../useFetch';
import usePagination from '../pagination/usePagination';
import { processTableData } from '@app/utils/processTableData';
import useResetPageWhenPageLimitChanges from '@app/utils/resetPageWhenPageLimitChanges';
import useSearch from '../useSearch';

type Asset = {
  name: string;
  machine_type: string;
  serial_number: string;
  manufacturer: string;
  model: string;
  manufacture_year: number;
};

type Metadata = {
  asset: Asset;
  timestamp: string;
  topicId: string;
};

type AssetItem = {
  collection_id: string;
  serial_number: number;
  owner_account_id: string;
  metadata: Metadata;
};

type AssetList = AssetItem;

type Collection = {
  col_name: string
  col_symbol: string
  col_hedera_token_id: string
}

const useCollectionDetailController = (collection_id: string) => {
  const [totalPages, setTotalPages] = useState(1);

  const { searchFilters, handleSearchFilters } = useSearch();
  
  const {
    data: dataCollection,
    fetchData: fetchDataCollection,
    isLoading: isLoadingCollection,
  } = useFetch<Collection>({
    request: { get: services.collections.getOne },
  });

  const {
    data: dataAssets,
    fetchData: fetchDataAssets,
    isLoading: isLoadingAssets,
  } = useFetch<AssetList[]>({
    request: { get: services.collections.getCollectionAssets },
  });

  const pagination = usePagination({
    totalPages: totalPages,
    order: "tokenId",
    direction: "asc"
  });

  const tableData = processTableData(dataAssets, searchFilters, {
    ...pagination,
    order: pagination.order as keyof AssetList
  });

  useResetPageWhenPageLimitChanges(pagination);

  useEffect(() => {
    if (tableData) {
      setTotalPages(tableData.totalPages)
    }
  }, [tableData, setTotalPages]);

  useEffect(() => {
    fetchDataCollection(collection_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchDataAssets(collection_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    dataCollection,
    isLoadingCollection,
    isLoadingAssets,
    pagination,
    handleSearchFilters,
    tableData
  };
};

export default useCollectionDetailController;
