import { mask as masker, unMask } from 'remask';
import masks from './masks';

type MaskTypes =
  | 'cep'
  | 'cpf'
  | 'cnpj'
  | 'cpf_cnpj'
  | 'phone'
  | 'cellphone'
  | 'phone_cellphone'
  | 'hedera_account_id';

const handleValueMask = (
  value: string,
  type: MaskTypes,
  onChange?: (value: string) => string | void
) => {
  if (!value && onChange) return onChange(value);
  if (!value) return value;

  const originalValue = unMask(value);

  switch (type) {
    case 'cep':
      if (onChange) return onChange(masker(originalValue, masks.cep));
      return masker(originalValue, masks.cep);
    case 'cpf':
      if (onChange) return onChange(masker(originalValue, masks.cpf));
      return masker(originalValue, masks.cpf);
    case 'cnpj':
      if (onChange) return onChange(masker(originalValue, masks.cnpj));
      return masker(originalValue, masks.cnpj);
    case 'phone':
      if (onChange) return onChange(masker(originalValue, masks.phone));
      return masker(originalValue, masks.phone);
    case 'cellphone':
      if (onChange) return onChange(masker(originalValue, masks.cellphone));
      return masker(originalValue, masks.cellphone);
    case 'cpf_cnpj':
      if (onChange)
        return onChange(masker(originalValue, [masks.cpf, masks.cnpj]));
      return masker(originalValue, [masks.cpf, masks.cnpj]);
    case 'phone_cellphone':
      if (onChange)
        return onChange(masker(originalValue, [masks.phone, masks.cellphone]));
      return masker(originalValue, [masks.phone, masks.cellphone]);
    case 'hedera_account_id':
      if (onChange) 
        return onChange(masker(originalValue, masks.hedera_account_id));
      return masker(originalValue, masks.hedera_account_id);
    default:
      if (onChange) return onChange(value);
      return value;
  }
};

export default handleValueMask;
