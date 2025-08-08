import { signOut } from 'next-auth/react';
import api from '@app/config/api';
import services from '.';

const signIn = async (data: { usr_email: string; usr_password: string }) => {
  try {
    const response = api.post('/login', data);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.response.data.message);
  }
};

const logOut = async () => {
  services.localStorage.removeToken();
  await signOut({ redirect: true, callbackUrl: '/' });
};

const authService = { signIn, logOut };
export default authService;
