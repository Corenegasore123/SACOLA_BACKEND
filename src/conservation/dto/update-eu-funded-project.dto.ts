import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEUFundedProjectDto } from './create-eu-funded-project.dto';
import { TransformDate } from '../../common/transformers/date.transformer';

export class UpdateEUFundedProjectDto extends PartialType(CreateEUFundedProjectDto) {
  @ApiPropertyOptional({ description: 'Name of the EU funded project', example: 'Updated Project Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the project', example: 'Updated project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Start date of the project',
    type: Date,
    example: '2024-01-01T00:00:00.000Z'
  })
  @TransformDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ 
    description: 'End date of the project',
    type: Date,
    example: '2024-12-31T00:00:00.000Z'
  })
  @TransformDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Total budget amount in EUR', example: 50000 })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ description: 'ID of the conservation project this EU project is associated with' })
  @IsUUID()
  @IsOptional()
  conservationProjectId?: string;

  @ApiPropertyOptional({ description: 'Current status of the EU funded project', enum: ['planned', 'ongoing', 'completed', 'cancelled'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'EU project reference number', example: 'EU-2023-001' })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Name of the funding program', example: 'Horizon Europe' })
  @IsString()
  @IsOptional()
  fundingProgram?: string;
}
