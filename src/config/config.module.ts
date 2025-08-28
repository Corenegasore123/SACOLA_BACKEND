import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [databaseConfig, jwtConfig],
      isGlobal: true,
      envFilePath: ['.env', '.env.local'], // Look for .env and .env.local files
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
