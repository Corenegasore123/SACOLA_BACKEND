import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConservationModule } from './conservation/conservation.module';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';
import { SocioEconomicModule } from './socio-economic/socio-economic.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { ProfileModule } from './profile/profile.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      envFilePath: ['.env', '.env.local', '.env.example'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // ✅ If Render DATABASE_URL exists, prefer that
        if (process.env.DATABASE_URL) {
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            autoLoadEntities: true,
            synchronize: configService.get<boolean>('database.synchronize'),
            logging: configService.get<boolean>('database.logging'),
          };
        }

        // ✅ Otherwise use local .env values
        return {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          schema: configService.get<string>('database.schema'),
          autoLoadEntities: true,
          synchronize: configService.get<boolean>('database.synchronize'),
          logging: configService.get<boolean>('database.logging'),
        };
      },
    }),
    AuthModule,
    ConservationModule,
    MailModule,
    OtpModule,
    SocioEconomicModule,
    ProfileModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
