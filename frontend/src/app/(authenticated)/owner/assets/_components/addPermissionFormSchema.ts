import * as yup from 'yup';

export const addPermissionFormSchema = yup
  .object({
    com_id: yup.string().required('Mantainers é obrigatório.')
  })
  .required();
