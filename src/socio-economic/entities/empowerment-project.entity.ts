import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('empowerment_tailoring_entries')
export class EmpowermentTailoringEntryData {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Tailoring center' })
  tailoringCenter: string;

  @Column()
  @ApiProperty({ description: 'Location' })
  location: string;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'People trained' })
  people: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Materials provided', required: false })
  materials?: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Training duration in days', required: false })
  trainingDuration?: number;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'Date (YYYY-MM-DD format)',
    example: '2024-01-15',
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
