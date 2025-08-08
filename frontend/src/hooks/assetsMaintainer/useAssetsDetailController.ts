import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addMessagesFormSchema } from "@app/app/(authenticated)/maintainer/assets/_components/addMessagesFormSchema";
import handleErrorMessage from "@app/utils/handleErrorMessage";
import { toaster } from "@app/components/ui/toaster";
import constants from "@app/constants";
import services from "@app/services";
import useBaseAssetsDetailController from "../assets/useBaseAssetsDetailController";

export type AddMessagesDto = {
  ame_message: string
}

const useAssetsDetailController = (baseAssetsDetailController: ReturnType<typeof useBaseAssetsDetailController>) => {
  const [isOpenAddMessagesModal, setIsOpenAddMessagesModal] = useState(false);
  const [isLoadingAddMessages, setIsLoadingAddMessages] = useState(false);

  const { 
    fetchData,
    ass_id
  } = baseAssetsDetailController;

  const handleIsOpenAddMessagesModal = () => {
    setIsOpenAddMessagesModal((prev) => !prev);
  };

  const formMethods = useForm<AddMessagesDto>({
    resolver: yupResolver(addMessagesFormSchema),
    defaultValues: {
      ame_message: '',
    },
  });

  const handleAddMessagesResponse = () => {
    toaster.create({
      title: "Mensagem adicionada com sucesso!",
      type: "success",
      duration: constants.api.POP_UP_TIMEOUT,
    });
    
    handleIsOpenAddMessagesModal();
    setIsLoadingAddMessages(false)
    formMethods.reset()

    fetchData({ ass_id });
  };

  const handleAddMessagesModal = async (data: AddMessagesDto) => {
    try {
      setIsLoadingAddMessages(true)

      const response = await services.assets.addMessages(data.ame_message, ass_id);
      if (response.status === 201) handleAddMessagesResponse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrorMessage(err);
    } finally {
      setIsLoadingAddMessages(false);
    }
  };
  
  return {
    formMethods,
    handleIsOpenAddMessagesModal,
    isOpenAddMessagesModal,
    isLoadingAddMessages,
    handleAddMessagesModal
  };
};

export default useAssetsDetailController;