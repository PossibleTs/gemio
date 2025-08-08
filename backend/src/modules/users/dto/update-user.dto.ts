import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserProfileDto {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  usr_name: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  usr_email: string;
}
export class UpdateUserPasswordDto {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  usr_password: string;
}
