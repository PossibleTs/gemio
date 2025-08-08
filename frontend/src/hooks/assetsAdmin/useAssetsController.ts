import constants from "@app/constants";
import { toaster } from '@app/components/ui/toaster';
import useBaseAssetsController from "../assets/useBaseAssetsController";
import { useState } from "react";
import services from "@app/services";
import handleErrorMessage from "@app/utils/handleErrorMessage";

const useAssetsController = (baseAssetsController: ReturnType<typeof useBaseAssetsController>) => {
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false);
  const [approveModalIsOpen, setApproveModalIsOpen] = useState(false);
  const [assetIdToApprove, setAssetIdToApprove] = useState<
    number | null
  >(null);

  const { 
    fetchData
  } = baseAssetsController;

  const handleIsOpenApproveModal = (ass_id?: number) => {
    if (ass_id) {
      setAssetIdToApprove(ass_id);
    } else {
      setAssetIdToApprove(null);
    }
    setApproveModalIsOpen((prev) => !prev);
  };

  const handleApproveResponse = () => {
    toaster.create({
      title: 'Equipamento aprovado com sucesso!',
      type: 'success',
      duration: constants.api.POP_UP_TIMEOUT,
    });
    handleIsOpenApproveModal();
    fetchData();
  };

  const handleApprove = async () => {
    try {
      if (!assetIdToApprove) {
        console.error("handleApprove: Asset id doesn't find");
        return;
      }
      setIsLoadingApprove(true);

      const ass_id = assetIdToApprove

      const response = await services.assets.approve(ass_id);

      if (response.status === 200) handleApproveResponse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrorMessage(err);
    } finally {
      setIsLoadingApprove(false);
    }
  };

  return {
    handleApprove,
    isLoadingApprove,
    approveModalIsOpen,
    handleIsOpenApproveModal
  };
};

export default useAssetsController;