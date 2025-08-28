import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLivestockDto } from './create-livestock.dto';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateLivestockDto extends PartialType(CreateLivestockDto) {
  @ApiPropertyOptional({
    description: 'Date donated (YYYY-MM-DD format)',
    example: '2024-01-15',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dateDonated?: string;
}
