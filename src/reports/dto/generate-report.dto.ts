import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { TransformDate } from '../../common/transformers/date.transformer';

export class GenerateReportDto {
  @ApiProperty({ enum: ['Conservation', 'Socio-Economic'] })
  @IsEnum(['Conservation', 'Socio-Economic'] as any)
  projectCategory: 'Conservation' | 'Socio-Economic';

  @ApiProperty()
  @IsString()
  projectType: string;

  @ApiProperty({ enum: ['Annual', 'Monthly', 'Custom'] })
  @IsEnum(['Annual', 'Monthly', 'Custom'] as any)
  reportType: 'Annual' | 'Monthly' | 'Custom';

  @ApiProperty()
  @TransformDate()
  dateRangeStart: Date;

  @ApiProperty()
  @TransformDate()
  dateRangeEnd: Date;
}


