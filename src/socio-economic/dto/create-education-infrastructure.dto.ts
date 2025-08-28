import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateEducationInfrastructureDto {
  @ApiProperty()
  @IsString()
  schoolName: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  infrastructureType: string;

  @ApiProperty({
    description: 'Date when infrastructure was donated (YYYY-MM-DD format)',
    example: '2024-01-15',
    format: 'date',
    type: String,
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  dateDonated: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
