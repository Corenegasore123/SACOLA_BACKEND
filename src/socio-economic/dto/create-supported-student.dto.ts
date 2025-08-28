import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, Matches } from 'class-validator';

export class CreateSupportedStudentDto {
  @ApiProperty()
  @IsString()
  studentName: string;

  @ApiProperty()
  @IsString()
  studentLocation: string;

  @ApiProperty()
  @IsString()
  schoolName: string;

  @ApiProperty()
  @IsString()
  schoolLocation: string;

  @ApiProperty()
  @IsString()
  class: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  fundingYears: number;

  @ApiProperty({
    description: 'Date when support was provided (YYYY-MM-DD format)',
    example: '2024-01-15',
    format: 'date',
    type: String,
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
