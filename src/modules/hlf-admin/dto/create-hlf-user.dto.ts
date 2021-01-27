import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateHlfUserDto {
  @ApiProperty()
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsNotEmpty()
  affiliation: string;
}
