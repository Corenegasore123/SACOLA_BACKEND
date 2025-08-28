import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/users')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    const user = await this.profileService.getProfile(req.user.id);
    return {
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '',
      email: user.email,
      role: user.role,
    };
  }

  @Put('me/password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    await this.profileService.updatePassword(req.user.id, dto.currentPassword, dto.newPassword, dto.confirmNewPassword);
    return { message: 'Password updated successfully' };
  }
}


