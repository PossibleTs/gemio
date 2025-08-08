import * as yup from 'yup';

export const addMessagesFormSchema = yup
  .object({
    ame_message: yup.string().required('Mensagem é obrigatória.')
  })
  .required();