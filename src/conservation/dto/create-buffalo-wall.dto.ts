import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches } from 'class-validator';

export class CreateBuffaloWallDto {
  @ApiProperty({ description: 'Date when the buffalo wall was repaired (YYYY-MM-DD)' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dateRepaired: string;

  @ApiProperty({ description: 'Cost of the buffalo wall repair' })
  @IsNumber()
  cost: number;
}
