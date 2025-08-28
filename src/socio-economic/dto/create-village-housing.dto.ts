import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, Matches } from 'class-validator';

export class CreateVillageHousingDto {
  @ApiProperty()
  @IsString()
  villageName: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  totalHouses: number;

  @ApiProperty({
    description: 'Date when village housing was built (YYYY-MM-DD format)',
    example: '2024-01-15',
    format: 'date',
    type: String,
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  dateBuilt: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  goodCondition: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  badCondition: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  badConditionDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
