import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string, confirmPassword?: string): Promise<void> {
    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) throw new BadRequestException('Invalid current password');

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }

  async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    
    // Verify password before allowing account deletion
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password. Account deletion cancelled.');
    }
    
    // Only delete the user from the users table
    // This prevents dashboard access but preserves all data they created
    // Data integrity is maintained across all modules
    await this.userRepository.remove(user);
  }
}


