import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAssetDto {
  @IsNumber()
  @IsPositive()
  ass_col_id: number;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  ass_name: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  ass_machine_type: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  ass_serial_number: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  ass_manufacturer: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  ass_model: string;

  @IsNumber()
  @IsPositive()
  ass_manufacture_year: number;
}
