import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, Matches } from 'class-validator';

export class CreateEducationMaterialsDto {
  @ApiProperty()
  @IsString()
  materialType: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  distributedMaterials: number;

  @ApiProperty({
    description: 'Date when materials were donated (YYYY-MM-DD format)',
    example: '2024-01-15',
    format: 'date',
    type: String
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  dateDonated: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  targetBeneficiaries: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  currentBeneficiaries: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
