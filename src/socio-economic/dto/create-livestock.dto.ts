import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, Matches } from 'class-validator';

export class CreateLivestockDto {
  @ApiProperty()
  @IsString()
  animalType: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  distributedAnimals: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  born: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  deaths: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  soldAnimals: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  transferredAnimals: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  currentlyOwned: number;

  @ApiProperty({
    description: 'Date donated (YYYY-MM-DD format)',
    example: '2024-01-15',
    format: 'date',
    type: String,
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dateDonated: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
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
