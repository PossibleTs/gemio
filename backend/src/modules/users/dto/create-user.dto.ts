import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
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
}
