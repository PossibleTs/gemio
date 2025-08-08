import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PostMessageDto {
  @MaxLength(2000)
  @IsString()
  @IsNotEmpty()
  ame_message: string;
}
