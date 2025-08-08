const LOCAL_STORAGE_TAG = 'gemio@';

const saveToken = (token: string) => {
  if (typeof window !== 'undefined')
    return localStorage.setItem(`${LOCAL_STORAGE_TAG}token`, token);

  return '';
};

const getToken = () => {
  if (typeof window !== 'undefined')
    return localStorage.getItem(`${LOCAL_STORAGE_TAG}token`);

  return '';
};

const removeToken = () => {
  if (typeof window !== 'undefined')
    return localStorage.removeItem(`${LOCAL_STORAGE_TAG}token`);

  return '';
};

const localSotageServices = {
  saveToken,
  getToken,
  removeToken,
};

export default localSotageServices;
