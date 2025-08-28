import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDate, TransformDateFuture } from '../../common/transformers/date.transformer';

class ProjectActivityDto {
  @ApiProperty({ description: 'Name of the activity' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Description of the activity',
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Start date of the activity',
    type: Date,
    example: '2024-01-15'
  })
  @TransformDate()
  startDate: Date;

  @ApiProperty({ 
    description: 'End date of the activity',
    type: Date,
    example: '2024-01-15',
    required: false 
  })
  @TransformDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ 
    description: 'Status of the activity',
    enum: ['planned', 'in_progress', 'completed', 'delayed', 'cancelled']
  })
  @IsString()
  @IsEnum(['planned', 'in_progress', 'completed', 'delayed', 'cancelled'])
  status: string;
}

export class CreateConservationProjectDto {
  @ApiProperty({ description: 'Name of the conservation project' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the project' })
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Location of the project',
    required: false 
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ 
    description: 'Start date of the project',
    type: Date 
  })
  @TransformDate()
  startDate: Date;

  @ApiProperty({ 
    description: 'End date of the project',
    type: Date,
    required: false 
  })
  @TransformDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ 
    description: 'Project status',
    enum: ['planning', 'active', 'completed', 'on_hold', 'cancelled']
  })
  @IsString()
  @IsEnum(['planning', 'active', 'completed', 'on_hold', 'cancelled'])
  status: string;

  @ApiProperty({ 
    description: 'Total budget for the project',
    minimum: 0,
    required: false 
  })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiProperty({ 
    description: 'Funding source',
    required: false 
  })
  @IsString()
  @IsOptional()
  fundingSource?: string;

  @ApiProperty({ 
    description: 'List of project activities',
    type: [ProjectActivityDto],
    required: false 
  })
  @IsArray()
  @IsOptional()
  activities?: ProjectActivityDto[];

  @ApiProperty({ 
    description: 'Project objectives',
    type: [String],
    required: false 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  objectives?: string[];

  @ApiProperty({ 
    description: 'Expected outcomes',
    type: [String],
    required: false 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  expectedOutcomes?: string[];

  @ApiProperty({ 
    description: 'Target species',
    type: [String],
    required: false 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetSpecies?: string[];

  @ApiProperty({ 
    description: 'Habitats covered by the project',
    type: [String],
    required: false 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  habitats?: string[];

  @ApiProperty({ 
    description: 'Name of the project manager',
    required: false 
  })
  @IsString()
  @IsOptional()
  projectManager?: string;

  @ApiProperty({ 
    description: 'Contact email for the project',
    required: false 
  })
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiProperty({ 
    description: 'Project website URL',
    required: false 
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ 
    description: 'GPS coordinates of the project area (latitude,longitude)',
    example: '-1.2921,36.8219',
    required: false
  })
  @IsString()
  @IsOptional()
  coordinates?: string;

  @ApiProperty({ 
    description: 'Additional notes about the project',
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
