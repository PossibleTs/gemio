
import api from '@app/config/api';
import { NewAssetFormDto } from '@app/hooks/assetsOwner/useNewAssetController';

const fetchAll = async () => {
  try {
    const response = api.get('/assets/requests');

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.response.data.message);
  }
};

export type CreateAssetParams = NewAssetFormDto;
const createOne = async (payload: CreateAssetParams) => {
  try {
    const response = await api.post('/assets/request', payload);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.response.data.message);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const approve = async (ass_id: any) => {
  try {
    const response = api.post(`/assets/request/${ass_id}/approve`);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response.data.message);
  }
};

const addMessages = async (ame_message: string, ass_id: number) => {
  try {
    const payload = {
      ame_message: ame_message
    }
    const response = await api.post(`/assets/${ass_id}/message`, payload);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

const deletePermission = async (map_id: number, ass_id: number) => {
  try {
    const response = await api.delete(`/assets/${ass_id}/permission/${map_id}`);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

const addPermission = async (com_id: number, ass_id: number) => {
  try {
    const payload = {
      map_com_id: com_id
    }
    const response = await api.post(`/assets/${ass_id}/permission`, payload);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

type FetchPermissionsParams = {
  ass_id: number;
};
const fetchPermissions = async (params: FetchPermissionsParams) => {
  try {
    const response = await api.get(`/assets/${params.ass_id}/permissions`);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

type fetchMessagesParams = {
  ass_id: number;
};
const fetchMessages = async (params: fetchMessagesParams) => {
  try {
    const response = await api.get(`/assets/${params.ass_id}/messages`);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

const assets = { 
  fetchAll, 
  createOne, 
  fetchPermissions, 
  approve, 
  deletePermission, 
  addPermission, 
  fetchMessages, 
  addMessages 
};

export default assets;