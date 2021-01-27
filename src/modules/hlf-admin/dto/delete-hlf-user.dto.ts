import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteHlfUserDto {
  @ApiProperty()
  @IsNotEmpty()
  user: string;
}
