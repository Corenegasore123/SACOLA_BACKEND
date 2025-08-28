import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateITTrainingDto } from './create-it-training.dto';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateITTrainingDto extends PartialType(CreateITTrainingDto) {
  @ApiPropertyOptional({
    description: 'Date of the training (YYYY-MM-DD format)',
    example: '2024-01-15',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;
}
