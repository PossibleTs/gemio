import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { toaster } from '@app/components/ui/toaster';

import constants from '@app/constants';
import { signInFormSchema } from '@app/app/(authentication)/_components/login/signInFormSchema';
import { signIn as signInNA } from 'next-auth/react';
import handleErrorMessage from '@app/utils/handleErrorMessage';

const useAuthController = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formMethods = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const handleSignInResponse = async () => {
    toaster.create({
      title: 'Login efetuado com sucesso!',
      type: 'success',
      duration: constants.api.POP_UP_TIMEOUT,
    });
  };

  const signIn = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const { email, password } = data;

      await signInNA('credentials', {
        redirect: false,
        email,
        password,
      }).then((res) => {
        if (res?.error) {
          handleErrorMessage({ message: res.error });
        } else {
          handleSignInResponse();
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, signIn, formMethods };
};

export default useAuthController;
