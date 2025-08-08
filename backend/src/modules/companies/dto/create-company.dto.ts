import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateCompanyDto {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  usr_name: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  usr_email: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  usr_password: string;

  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  com_name: string;

  @Length(14, 14)
  @IsString()
  com_cnpj: number;

  @IsEnum({ creator: 'creator', owner: 'owner', maintainer: 'maintainer' })
  com_type: string;

  @IsBoolean()
  com_create_wallet: boolean;

  @MaxLength(30)
  @IsString()
  com_hedera_account_id: string;

  @MaxLength(300)
  @IsString()
  com_hedera_mnemonic_phrase: string;

  @MaxLength(300)
  @IsString()
  com_hedera_private_key: string;
}
