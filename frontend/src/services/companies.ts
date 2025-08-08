import api from '@app/config/api';

const fetchAll = async () => {
  try {
    const response = api.get('/companies');

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.response.data.message);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const approve = async (com_id: any) => {
  try {
    const response = api.post(`/companies/${com_id}/approve`);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response.data.message);
  }
};

const companiesService = { fetchAll, approve };
export default companiesService;
