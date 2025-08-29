import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches } from 'class-validator';
import { WorkerCategory } from '../entities/workers.entity';

export class CreateWorkerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty({
    description: 'Employment start date (YYYY-MM-DD)',
    example: '2024-01-15',
    format: 'date',
    type: String,
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  dateEmployed: string;

  @ApiProperty({ enum: WorkerCategory, enumName: 'WorkerCategory' })
  @IsEnum(WorkerCategory)
  category: WorkerCategory;
}


