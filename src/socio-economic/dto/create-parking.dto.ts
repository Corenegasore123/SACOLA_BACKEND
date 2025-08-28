import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, Matches } from 'class-validator';

export class CreateParkingDto {
  @ApiProperty()
  @IsString()
  parkingName: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  carsSupported: number;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Date when parking was built (YYYY-MM-DD format)',
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
