import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateWaterPumpsDto {
  @ApiProperty()
  @IsString()
  pumpName: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Date when water pump was built (YYYY-MM-DD format)',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  dateBuilt: string;

  @ApiProperty()
  @IsString()
  pumpCondition: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
