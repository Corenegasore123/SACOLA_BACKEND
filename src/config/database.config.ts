import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',  // Explicitly set type to postgres
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'sacola',
  schema: process.env.DB_SCHEMA || 'public',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // Auto-create tables for any environment except explicit production
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  // Add SSL configuration if needed for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}));
