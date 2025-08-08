import * as yup from 'yup';

export const editPasswordFormSchema = yup
  .object({
    usr_password: yup
      .string()
      .required('A senha é obrigatória')
      .min(6, 'A senha precisa ter pelo menos 6 caracteres'),
    usr_confirm_password: yup
      .string()
      .required('A confirmação da senha é obrigatória')
      .oneOf([yup.ref('usr_password')], 'As senhas precisam ser iguais'),
  })
  .required();