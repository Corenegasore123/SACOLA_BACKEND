import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import dotenv from 'dotenv';

dotenv.config();

async function syncDatabase() {
  console.log('Starting database synchronization...');
  console.log('NODE_ENV:', process.env.NODE_ENV);

  const isRender = !!process.env.DATABASE_URL;

  const AppDataSource = new DataSource(
    isRender
      ? {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
          entities: [User],
          synchronize: true,
          logging: true,
        }
      : {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'root',
          database: process.env.DB_DATABASE || 'sacola',
          schema: process.env.DB_SCHEMA || 'public',
          entities: [User],
          synchronize: true,
          logging: true,
        }
  );

  try {
    const connection = await AppDataSource.initialize();
    console.log('✅ Database connection established successfully!');

    console.log('🔄 Synchronizing database...');
    await connection.synchronize(false);
    console.log('✅ Database synchronized successfully!');

    await connection.destroy();
    console.log('🔒 Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    process.exit(1);
  }
}

syncDatabase();
