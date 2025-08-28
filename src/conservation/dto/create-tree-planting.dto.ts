import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsDefined, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTreePlantingDto {
  @ApiProperty({ description: 'Type of trees planted' })
  @IsString()
  @IsNotEmpty()
  treeType: string;

  @ApiProperty({ description: 'Location where trees were planted' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Number of trees planted' })
  @IsNumber()
  @Type(() => Number)
  numberOfTrees: number;

  @ApiProperty({ 
    description: 'Date when trees were planted (YYYY-MM-DD format)',
    example: '2024-01-15',
    format: 'date'
  })
  @IsDefined()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  datePlanted: string;

  @ApiProperty({ description: 'Description of the tree planting project', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Target number of beneficiaries' })
  @IsNumber()
  @Type(() => Number)
  targetBeneficiaries: number;

  @ApiProperty({ description: 'Current number of beneficiaries' })
  @IsNumber()
  @Type(() => Number)
  currentBeneficiaries: number;
}
