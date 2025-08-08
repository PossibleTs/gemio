import api from '@app/config/api';
import { RegistrationFormDto } from '@app/hooks/register/useRegisterController';

export type CreateCompanyParams = Omit<
  RegistrationFormDto,
  'com_confirm_password'
>;
const createOne = async (payload: CreateCompanyParams) => {
  try {
    const response = await api.post('/companies', payload);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.response.data.message);
  }
};

const subscribers = {
  create: createOne,
};

export default subscribers;
