import api from '@app/config/api';
import { NewCollectionFormDto } from '@app/hooks/collections/useNewCollectionController';

const fetchAll = async () => {
  try {
    const response = api.get('/collections');

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.response.data.message);
  }
};

export type CreateCollectionParams = NewCollectionFormDto;
const createOne = async (payload: CreateCollectionParams) => {
  try {
    const response = await api.post('/collections', payload);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.response.data.message);
  }
};

const getOne = async (collection_id: string) => {
  try {
    const response = api.get(`/collections/${collection_id}`);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.response.data.message);
  }
};

const getCollectionAssets = async (collection_id: string) => {
  try {
    const response = api.get(`/collections/${collection_id}/assets`);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.response.data.message);
  }
};

const companiesService = { fetchAll, createOne, getOne, getCollectionAssets };
export default companiesService;
