import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the OTP' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Email address associated with the OTP' })
  @Index()
  email: string;

  @Column()
  @ApiProperty({ description: 'The OTP code' })
  code: string;

  @Column()
  @ApiProperty({ description: 'Whether the OTP has been used' })
  isUsed: boolean;

  @Column({ name: 'expires_at' })
  @ApiProperty({ description: 'Expiration timestamp of the OTP' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  markAsUsed(): void {
    this.isUsed = true;
  }
}
