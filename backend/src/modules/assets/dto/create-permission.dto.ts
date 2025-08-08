import { IsNumber, IsPositive } from 'class-validator';

export class CreatePermissionDto {
  @IsNumber()
  @IsPositive()
  map_com_id: number;
}
