import * as yup from 'yup';

export const editProfileFormSchema = yup
  .object({
    usr_name: yup.string().required('Nome é obrigatório.'),
    usr_email: yup.string().required('E-mail é obrigatório.'),
  })
  .required();