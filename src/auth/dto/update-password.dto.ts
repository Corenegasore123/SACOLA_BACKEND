import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'New password (min 8 characters)', example: 'new-secure-password-123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({ description: 'Confirm new password', example: 'new-secure-password-123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  confirmNewPassword: string;
}


