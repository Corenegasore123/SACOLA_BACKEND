import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('it_training_entries')
export class ITTrainingEntryData {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Center name' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Location' })
  location: string;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Number of people' })
  numPeople: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Materials provided', required: false })
  materials?: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Training duration in days', required: false })
  trainingDuration?: number;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'Date when the training was conducted (YYYY-MM-DD format)',
  })
  date: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Description', required: false })
  description?: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}
