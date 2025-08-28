import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateSportsDto {
  @ApiProperty()
  @IsString()
  sportName: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  condition: string;

  @ApiProperty({
    description: 'Date when sports infrastructure was built (YYYY-MM-DD format)',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  dateBuilt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}


