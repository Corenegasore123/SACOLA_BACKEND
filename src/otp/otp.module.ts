import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { Otp } from './entities/otp.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Otp]),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
