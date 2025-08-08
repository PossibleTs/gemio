import { useEffect, useState } from 'react';
import services from '@app/services';
import useFetch from '../useFetch';
import { toaster } from '@app/components/ui/toaster';
import constants from '@app/constants';
import { CompanyDto } from '@app/types/Company';
import usePagination from '@app/hooks/pagination/usePagination';
import useSearch from '@app/hooks/useSearch';
import useResetPageWhenPageLimitChanges from '@app/utils/resetPageWhenPageLimitChanges';
import { processTableData } from '@app/utils/processTableData';
import handleErrorMessage from '@app/utils/handleErrorMessage';

const useCompaniesController = () => {
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(1);
  const [approveModalIsOpen, setApproveModalIsOpen] = useState(false);
  const [companyIdToApprove, setCompanyIdToApprove] = useState<
    number | null
  >(null);

  const { data, fetchData, isLoading } = useFetch<CompanyDto[]>({
    request: { get: services.companies.fetchAll },
  });

  const { searchFilters, handleSearchFilters } = useSearch();

  const handleIsOpenApproveModal = (com_id?: number) => {
    if (com_id) {
      setCompanyIdToApprove(com_id);
    } else {
      setCompanyIdToApprove(null);
    }
    setApproveModalIsOpen((prev) => !prev);
  };

  const handleApproveResponse = () => {
    toaster.create({
      title: 'Empresa aprovada com sucesso!',
      type: 'success',
      duration: constants.api.POP_UP_TIMEOUT,
    });
    handleIsOpenApproveModal()
    fetchData();
  };

  const handleApprove = async () => {
    try {
      if (!companyIdToApprove) {
        console.error("handleApprove: Company id doesn't find");
        return;
      }
      setIsLoadingApprove(true);

      const com_id = companyIdToApprove

      const response = await services.companies.approve(com_id);

      if (response.status === 200) handleApproveResponse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrorMessage(err);
    } finally {
      setIsLoadingApprove(false);
    }
  };
  
  const pagination = usePagination({
    totalPages: totalPages,
    order: "com_id",
    direction: "asc"
  });

  const tableData = processTableData(data, searchFilters, {
    ...pagination,
    order: pagination.order as keyof CompanyDto
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
    data,
    isLoading,
    isLoadingApprove,
    handleIsOpenApproveModal,
    pagination,
    searchFilters,
    handleSearchFilters,
    tableData,
    approveModalIsOpen,
    handleApprove
  };
};

export default useCompaniesController;
