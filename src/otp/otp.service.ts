import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Otp } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) {}

  generateOtp(): string {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async saveOtp(email: string, otp: string, expiresInMinutes = 10): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

    // Delete any existing OTPs for this email
    await this.otpRepository.delete({ email });

    // Save new OTP
    const otpEntity = this.otpRepository.create({
      email,
      code: otp,
      isUsed: false,
      expiresAt,
    });

    await this.otpRepository.save(otpEntity);
  }

  async validateOtp(email: string, otp: string): Promise<boolean> {
    const otpEntity = await this.otpRepository.findOne({
      where: { email, code: otp, isUsed: false },
    });

    if (!otpEntity) {
      return false;
    }

    if (otpEntity.isExpired()) {
      return false;
    }

    // Mark OTP as used
    otpEntity.markAsUsed();
    await this.otpRepository.save(otpEntity);

    return true;
  }

  async generateAndSaveOtp(email: string, expiresInMinutes = 10): Promise<string> {
    const otp = this.generateOtp();
    await this.saveOtp(email, otp, expiresInMinutes);
    return otp;
  }

  generateRandomToken(length = 32): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }

  generatePasswordResetToken(): { token: string; expiresAt: Date } {
    const token = this.generateRandomToken(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    return {
      token,
      expiresAt,
    };
  }
}
