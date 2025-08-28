import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestResetDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;
}

