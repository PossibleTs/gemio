import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toaster } from '@app/components/ui/toaster';
import constants from "@app/constants";
import services from "@app/services";
import handleErrorMessage from "@app/utils/handleErrorMessage";
import { useSession } from "next-auth/react";
import { UseSessionReturn } from "@app/types/Session";
import { editPasswordFormSchema } from "@app/app/(authenticated)/_components/profile/editPassword/editPasswordFormSchema";

export type EditPasswordFormDto = {
  usr_password: string;
  usr_confirm_password: string;
};

const useEditPasswordController = () => {
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession() as UseSessionReturn;

  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const basePath = session.data?.user?.usr_permission === 'company'
    ? session.data?.user?.com_type
    : session.data?.user?.usr_permission;

  const formMethods = useForm<EditPasswordFormDto>({
    resolver: yupResolver(editPasswordFormSchema),
    defaultValues: {
      usr_password: '',
      usr_confirm_password: '',
    },
  });

  const handleEditPasswordResponse = async () => {
    toaster.create({
      title: 'Senha alterada com sucesso!',
      type: 'success',
      duration: constants.api.POP_UP_TIMEOUT,
    });
    formMethods.reset()
    router.push(`/${basePath}/profile`);
  };

  const handleEditPassword = async (data: EditPasswordFormDto) => {
    try {
      setIsLoading(true);

      const response = await services.profile.editPassword(data);

      if (response.status === 200) {
        handleEditPasswordResponse();
      }
    } catch (err) {
      handleErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    formRef,
    handleEditPassword,
    formMethods
  };
};

export default useEditPasswordController;