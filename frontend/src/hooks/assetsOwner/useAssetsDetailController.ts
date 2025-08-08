import services from "@app/services";
import useSearch from "../useSearch";
import useFetch from "../useFetch";
import { toaster } from "@app/components/ui/toaster";
import constants from "@app/constants";
import handleErrorMessage from "@app/utils/handleErrorMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addPermissionFormSchema } from "@app/app/(authenticated)/owner/assets/_components/addPermissionFormSchema";
import { CompanyDto } from "@app/types/Company";
import { useEffect, useState } from "react";
import { processTableData } from "@app/utils/processTableData";
import usePagination from "../pagination/usePagination";
import useResetPageWhenPageLimitChanges from "@app/utils/resetPageWhenPageLimitChanges";
import {default as useBaseAssetsDetailController} from "../assets/useBaseAssetsDetailController";
import { PermissionDto } from "@app/types/Permission";

export type AddPermissionDto = {
  com_id: string
}

const useAssetsDetailController = (baseAssetsDetailController: ReturnType<typeof useBaseAssetsDetailController>) => {
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [permissionIdToDelete, setPermissionIdToDelete] = useState<
    number | null
  >(null);
  const [isLoadingAddPermission, setIsLoadingAddPermission] = useState(false);
  const [maintainer, setMaintainer] = useState<CompanyDto[]>([]);
  const [totalPagesPermissions, setTotalPagesPermissions] = useState(1);
  const [permissionEndDate, setPermissionEndDate] = useState('');
  const [isOpenAddPermissionModal, setIsOpenAddPermissionModal] = useState(false);
  const [isOpenAlertPermissionModal, setIsOpenAlertPermissionModal] = useState(false);

  const { 
    ass_id
  } = baseAssetsDetailController;
  
  
  const { 
    searchFilters: searchFiltersPermissions, 
    handleSearchFilters: handleSearchFiltersPermissions 
  } = useSearch();

  const { 
    fetchData: fetchDataPermissions, 
    data: dataPermissions, 
    isLoading: isLoadingPermissions 
  } = useFetch<PermissionDto[]>({
    request: {
      get: services.assets.fetchPermissions,
    },
  });

  const { 
    fetchData: fetchDataCompany, 
    data: dataCompany, 
    isLoading: isLoadingCompany 
  } = useFetch<CompanyDto[]>({
    request: { 
      get: services.companies.fetchAll 
    },
  });

  const formMethods = useForm<AddPermissionDto>({
    resolver: yupResolver(addPermissionFormSchema),
    defaultValues: {
      com_id: '',
    },
  });

  const hashscanLink = (id: number) => {
    const getPermission = permissionTableData.list.filter((item) => item.map_id === id)
    const getTopicTokenGateId = getPermission[0].ass_asset.ass_topic_token_gate_id
    const getSerialId = getPermission[0].map_tokengate_serial
    
    window.open(`
      ${process.env.NEXT_PUBLIC_HASHSCAN_URL}token/${getTopicTokenGateId}/${getSerialId}`, 
    '_blank');
  }

  const handleIsOpenAddPermissionModal = () => {
    setIsOpenAddPermissionModal((prev) => !prev);
  };

  const handleIsOpenAlertPermissionModal = () => {
    setIsOpenAlertPermissionModal((prev) => !prev);
  };

  const handleAddPermissionResponse = () => {
    toaster.create({
      title: "Permissão adicionada com sucesso!",
      type: "success",
      duration: constants.api.POP_UP_TIMEOUT,
    });
    
    handleIsOpenAddPermissionModal();
    setIsLoadingAddPermission(false)
    formMethods.reset()

    fetchDataPermissions({ ass_id });
  };

  const handleAddPermissionModal = async (data: AddPermissionDto) => {
    try {
      setIsLoadingAddPermission(true)

      const response = await services.assets.addPermission(Number(data.com_id), ass_id);
      if (response.status === 201) handleAddPermissionResponse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrorMessage(err);
    } finally {
      setIsLoadingAddPermission(false);
    }
  };

  const paginationPermissions = usePagination({
    totalPages: totalPagesPermissions,
    order: "map_id",
    direction: "asc"
  });

  const permissionTableData = processTableData(dataPermissions, searchFiltersPermissions, {
    ...paginationPermissions,
    order: paginationPermissions.order as keyof PermissionDto
  });


  useResetPageWhenPageLimitChanges(paginationPermissions);

  const selectOptions = maintainer.map((item) => ({
    label: item.com_name,
    value: `${item.com_id}`,
  }));

  const handleIsOpenDeleteModal = (id?: number) => {
    if (id) {
      setPermissionIdToDelete(id);
    } else {
      setPermissionIdToDelete(null);
    }
    setDeleteModalIsOpen((prev) => !prev);
  };

  const checkPermissionRemoved = (id: number) => {
    const getEndDate = permissionTableData.list.filter((item: PermissionDto) => item.map_id === id)[0]?.map_end_date
    
    const permissionRemoved = getEndDate === null || getEndDate === undefined ? false : true

    if (permissionRemoved) {
      handleIsOpenAlertPermissionModal()
      if (getEndDate) {
        setPermissionEndDate(getEndDate)
      }
    } else {
      handleIsOpenDeleteModal(id)
    }
  }

  const handleDeleteResponse = () => {
    handleIsOpenDeleteModal();
    toaster.create({
      title: "Permissão excluída com sucesso!",
      type: "success",
      duration: constants.api.POP_UP_TIMEOUT,
    });

    fetchDataPermissions({ ass_id });
  };

  const handleDeletePermission = async () => {
    try {
      if (!permissionIdToDelete) {
        console.error("handleDeletePermission: Permission id doesn't find");
        return;
      }
      setIsLoadingDelete(true);

      const map_id = permissionIdToDelete
      
      const response = await services.assets.deletePermission(map_id, ass_id );

      if (response.status === 200) handleDeleteResponse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrorMessage(err);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  useEffect(() => {
    const getMaintainers = async () => {
      try {
        const onlyMaintainers = dataCompany.filter((item: CompanyDto) => item.com_type === "maintainer");
        setMaintainer(onlyMaintainers);
      } catch (error) {
        console.error("Erro ao buscar companies:", error);
      }
    };

    getMaintainers();
  }, [dataCompany, setMaintainer]);

  useEffect(() => {
    if (permissionTableData) {
      setTotalPagesPermissions(permissionTableData.totalPages)
    }
  }, [permissionTableData, setTotalPagesPermissions]);

  useEffect(() => {
    fetchDataPermissions({ ass_id });
    fetchDataCompany()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return {
    handleDeletePermission,
    handleIsOpenDeleteModal,
    deleteModalIsOpen,
    isLoadingDelete,
    handleIsOpenAddPermissionModal,
    handleAddPermissionModal,
    isOpenAddPermissionModal,
    permissionTableData,
    isLoadingAddPermission,
    formMethods,
    selectOptions,
    isLoadingPermissions,
    paginationPermissions,
    handleSearchFiltersPermissions,
    isLoadingCompany,
    isOpenAlertPermissionModal,
    handleIsOpenAlertPermissionModal,
    checkPermissionRemoved,
    permissionEndDate,
    hashscanLink
  };
};

export default useAssetsDetailController;