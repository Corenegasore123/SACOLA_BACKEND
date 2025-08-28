import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateProjectEntryDto {
  @ApiProperty({ description: 'Name of the entry (e.g., beneficiary type, resource type)' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Number/count for this entry' })
  @IsNumber()
  number: number;
}

