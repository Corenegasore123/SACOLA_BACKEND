import { Controller, Get, Put, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/users')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() req: any) {
    const user = await this.profileService.getProfile(req.user.id);
    return {
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '',
      email: user.email,
      role: user.role,
    };
  }

  @Put('me/password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid password or confirmation mismatch' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    await this.profileService.updatePassword(req.user.id, dto.currentPassword, dto.newPassword, dto.confirmNewPassword);
    return { message: 'Password updated successfully' };
  }

  @Delete('me')
  @ApiOperation({ 
    summary: 'Delete user account',
    description: 'Removes user from the system after password confirmation. All data created by the user remains intact for data integrity.'
  })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteAccount(@Req() req: any, @Body() deleteAccountDto: DeleteAccountDto) {
    await this.profileService.deleteAccount(req.user.id, deleteAccountDto.password);
    return { 
      message: 'Account deleted successfully',
      note: 'Your account has been removed from the system. All data you created remains intact for data integrity purposes.'
    };
  }
}


