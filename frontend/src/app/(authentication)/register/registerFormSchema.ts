import * as yup from 'yup';

export const registerFormSchema = yup
  .object({
    usr_name: yup.string().required('O nome é obrigatório'),
    usr_email: yup
      .string()
      .email('Digite um e-mail válido')
      .required('O e-mail é obrigatório'),
    usr_password: yup
      .string()
      .required('A senha é obrigatória')
      .min(6, 'A senha precisa ter pelo menos 6 caracteres'),
    com_confirm_password: yup
      .string()
      .required('A confirmação da senha é obrigatória')
      .oneOf([yup.ref('usr_password')], 'As senhas precisam ser iguais'),
    com_cnpj: yup.string().required('CNPJ é obrigatório'),
    com_name: yup.string().required('Razão social é obrigatória'),
    com_type: yup.string().required(),
    com_create_wallet: yup.boolean().required(),
    com_hedera_account_id: yup.string().defined().strict(true),
    com_hedera_private_key: yup.string().defined().strict(true),
    com_hedera_mnemonic_phrase: yup.string().defined().strict(true),
  })
  .required();
