import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDate } from '../../common/transformers/date.transformer';

class ProjectEntryDto {
  @ApiProperty({ description: 'Name of the entry (e.g., beneficiary type, resource type)' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Number/count for this entry' })
  @IsNumber()
  @Type(() => Number)
  number: number;
}

export class CreateCustomProjectDto {
  @ApiProperty({ description: 'Name of the custom project' })
  @IsString()
  projectName: string;

  @ApiProperty({ description: 'Location of the project' })
  @IsString()
  location: string;

  @ApiProperty({ 
    description: 'Starting date of the project',
    type: Date,
    example: '2024-01-15'
  })
  @TransformDate()
  startingDate: Date;

  @ApiProperty({ description: 'Description of the custom project', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Initial project entries', 
    type: [ProjectEntryDto],
    required: false 
  })
  @IsArray()
  @IsOptional()
  entries?: ProjectEntryDto[];
}
