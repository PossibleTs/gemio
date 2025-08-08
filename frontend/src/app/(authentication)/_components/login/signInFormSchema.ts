import * as yup from 'yup';

export const signInFormSchema = yup
  .object({
    email: yup.string().required('E-mail é obrigatório.'),
    password: yup.string().required('Senha é obrigatória.'),
    keepConnected: yup.boolean().default(true),
  })
  .required();
