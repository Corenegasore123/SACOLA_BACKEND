import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyResetTokenDto } from './dto/verify-reset-token.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordOtpDto } from './dto/reset-password-otp.dto';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../mail/mail.service';
import { MoreThan } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    return isValidPassword ? user : null;
  }

  async login(loginDto: LoginDto): Promise<{ message: string; otp?: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate OTP
    const otp = await this.otpService.generateAndSaveOtp(user.email, 10);

    // Send OTP to user's email
    const sent = await this.mailService.sendOtpEmail(user.email, otp);

    // Always include OTP as per response contract
    return { message: 'OTP sent to your email', otp };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const { email, otp } = verifyOtpDto;

    // Validate OTP
    const isValidOtp = await this.otpService.validateOtp(email, otp);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Get user
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate JWT tokens
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '10h' });

    // Return user data without sensitive information
    const { password, otp: userOtp, otpExpiry, passwordResetToken, passwordResetExpires, ...userData } = user;

    return {
      accessToken,
      refreshToken,
      user: userData,
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isValidPassword) {
      throw new NotFoundException('Invalid current password');
    }

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.save(user);
  }

  async requestPasswordReset(requestResetDto: RequestResetDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email: requestResetDto.email } });
    if (!user) {
      // For security reasons, don't reveal if the user exists or not
      return { message: 'If the email exists, a reset OTP has been sent' };
    }

    // Generate OTP for password reset
    const otp = await this.otpService.generateAndSaveOtp(user.email, 15);

    // Send password reset OTP email
    await this.mailService.sendPasswordResetOtpEmail(user.email, otp);

    return { message: 'If the email exists, a reset OTP has been sent' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email: forgotPasswordDto.email } });
    if (!user) {
      // For security reasons, don't reveal if the user exists or not
      return;
    }

    // Generate a password reset token
    const { token, expiresAt } = this.otpService.generatePasswordResetToken();
    
    // Store the reset token in the user record
    user.passwordResetToken = token;
    user.passwordResetExpires = expiresAt;
    await this.userRepository.save(user);

    // Send password reset email
    await this.mailService.sendPasswordResetEmail(
      user.email,
      user.firstName || user.email,
      token
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, token, otp, newPassword, confirmNewPassword } = resetPasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('New password and confirmation do not match');
    }

    // Validate OTP for the email first (marks OTP as used if valid)
    const isValidOtp = await this.otpService.validateOtp(email, otp);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Find user by email and ensure token is valid and not expired
    const user = await this.userRepository.findOne({
      where: {
        email: email.toLowerCase(),
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    // Update the password and clear the reset token
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await this.userRepository.save(user);
  }

  async verifyResetToken(verifyResetTokenDto: VerifyResetTokenDto): Promise<{ message: string }> {
    const { email, token, otp } = verifyResetTokenDto;

    // Validate OTP for the email
    const isValidOtp = await this.otpService.validateOtp(email, otp);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Validate token and expiry for the user
    const user = await this.userRepository.findOne({
      where: {
        email: email.toLowerCase(),
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    return { message: 'Reset token and OTP verified' };
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto & { email: string }): Promise<{ message: string }> {
    const { email, newPassword, confirmNewPassword } = updatePasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('New password and confirmation do not match');
    }

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    // Clear any existing reset token
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async resetPasswordWithOtp(resetPasswordOtpDto: ResetPasswordOtpDto): Promise<{ message: string }> {
    const { email, otp, newPassword } = resetPasswordOtpDto;

    // Validate OTP
    const isValidOtp = await this.otpService.validateOtp(email, otp);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Find user
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async logout(userId: string): Promise<{ message: string }> {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return a success message
    // The client should remove the token from storage
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user || undefined;
  }
}
