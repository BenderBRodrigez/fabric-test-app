import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateAssetDto {
  @ApiPropertyOptional()
  @IsOptional()
  public text: string;

  @ApiPropertyOptional()
  @IsOptional()
  public owner: string;
}
