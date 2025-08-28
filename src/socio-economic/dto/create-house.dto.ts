import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateHouseDto {
  @ApiProperty()
  @IsString()
  houseCategory: string;

  @ApiProperty()
  @IsString()
  houseOwner: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Date when house was built (YYYY-MM-DD format)',
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
  @IsString()
  houseCondition: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  materials?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
