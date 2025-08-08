import * as yup from 'yup';

export const newAssetFormSchema = yup
  .object({
    ass_col_id: yup.number().required('Coleção é obrigatório.'),
    ass_name: yup.string().required('Nome é obrigatório.'),
    ass_machine_type: yup.string().required('Tipo é obrigatório.'),
    ass_serial_number: yup.string().required('Número serial é obrigatório.'),
    ass_manufacturer: yup.string().required('Fabricante é obrigatório.'),
    ass_model: yup.string().required('Modelo é obrigatório.'),
    ass_manufacture_year: yup.number().required('Ano de fabricação é obrigatório.'),
  })
  .required();
