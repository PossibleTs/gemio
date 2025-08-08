import { toaster } from '@app/components/ui/toaster';
import constants from '@app/constants';
import axios, { AxiosError } from 'axios';

const handleErrorMessage = (err: unknown | Error | AxiosError) => {
  const error = err as Error | AxiosError;
  let message = '';
  if (axios.isAxiosError(error)) {
    message = error?.response?.data?.message ?? '';
  } else {
    message = error?.message;
  }

  if (message) {
    toaster.create({
      title: message,
      type: 'error',
      duration: constants.api.POP_UP_TIMEOUT,
    });
  } else {
    toaster.create({
      title: 'Houve um problema. Por favor, tente mais tarde.', // mensagem genérica
      type: 'error',
      duration: constants.api.POP_UP_TIMEOUT,
    });
  }
};

export default handleErrorMessage;
