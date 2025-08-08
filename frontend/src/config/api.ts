import axios from 'axios';

import constants from '@app/constants';
import services from '@app/services';

const instance = axios.create({
  baseURL: constants.api.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// Middleware: Requisição - Token
instance.interceptors.request.use(async (config) => {
  const token = services.localStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
