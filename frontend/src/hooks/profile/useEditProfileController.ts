import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toaster } from '@app/components/ui/toaster';
import constants from "@app/constants";
import services from "@app/services";
import handleErrorMessage from "@app/utils/handleErrorMessage";
import { editProfileFormSchema } from "@app/app/(authenticated)/_components/profile/editProfile/editProfileFormSchema";
import { useSession } from "next-auth/react";
import { UseSessionReturn } from "@app/types/Session";

export type EditProfileFormDto = {
  usr_name: string;
  usr_email: string;
};

const useEditProfileController = () => {
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession() as UseSessionReturn;

  const { update } = useSession();

  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const basePath = session.data?.user?.usr_permission === 'company'
    ? session.data?.user?.com_type
    : session.data?.user?.usr_permission;

  const formMethods = useForm<EditProfileFormDto>({
    resolver: yupResolver(editProfileFormSchema),
    defaultValues: {
      usr_name: '',
      usr_email: '',
    },
  });

  const handleEditProfileResponse = async () => {
    toaster.create({
      title: 'Perfil atualizado com sucesso!',
      type: 'success',
      duration: constants.api.POP_UP_TIMEOUT,
    });
    router.push(`/${basePath}/profile`);
  };

  const handleEditProfile = async (data: EditProfileFormDto) => {
    try {
      setIsLoading(true);

      const response = await services.profile.editProfile(data);

      if (response.status === 200) {
        handleEditProfileResponse();

        await update({
          user: {
            ...session.data?.user,
            usr_name: data.usr_name,
            usr_email: data.usr_email,
          },
        });
      }
    } catch (err) {
      handleErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  };
  
   useEffect(() => {
    if (session.data?.user?.usr_name && session.data?.user?.usr_email) {
      formMethods.setValue('usr_name', session.data?.user.usr_name)
      formMethods.setValue('usr_email', session.data?.user.usr_email)
    }
  }, [session, formMethods]);

  return {
    isLoading,
    formRef,
    handleEditProfile,
    formMethods
  };
};

export default useEditProfileController;