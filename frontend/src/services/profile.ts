import api from '@app/config/api';

type EditProfileParams = {
  usr_name: string;
  usr_email: string;
};
const editProfile = async (data: EditProfileParams) => {
  try {
    const response = await api.patch(`/users/edit-profile`, data);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

type EditPasswordParams = {
  usr_password: string;
  usr_confirm_password: string;
};
const editPassword = async (data: EditPasswordParams) => {
  try {
    const payload = {
      usr_password: data.usr_password
    }
    const response = await api.patch(`/users/edit-password`, payload);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

const profile = { 
  editProfile,
  editPassword
};

export default profile;