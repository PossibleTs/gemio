import * as yup from 'yup';

export const newCollectionFormSchema = yup
  .object({
    name: yup.string().required('Nome é obrigatório.'),
    symbol: yup.string().required('Símbolo é obrigatório.'),
    description: yup.string().required('Descrição é obrigatória.'),
  })
  .required();