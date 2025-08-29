import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum WorkerCategory {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  VOLUNTEER = 'volunteers',
}

@Entity('workers_entries')
export class WorkersEntryData {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Worker full name' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Worker role or title' })
  role: string;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'Employment start date (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  dateEmployed: string;

  @Column({ type: 'enum', enum: WorkerCategory })
  @ApiProperty({
    description: 'Employment category',
    enum: WorkerCategory,
    enumName: 'WorkerCategory',
  })
  category: WorkerCategory;

  @CreateDateColumn()
  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}


