import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBambooPlantationDto {
  @ApiProperty({ description: 'Distance covered by the bamboo plantation' })
  @IsNumber()
  @Type(() => Number)
  distanceCovered: number;

  @ApiProperty({ description: 'Location of the bamboo plantation' })
  @IsString()
  location: string;

  @ApiProperty({ 
    description: 'Date when bamboo was planted (YYYY-MM-DD)'
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  datePlanted: string;

  @ApiProperty({ description: 'Description of the bamboo plantation project', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
