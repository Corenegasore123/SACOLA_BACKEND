import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('education_infrastructures_entries')
export class EducationInfrastructuresEntryData {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @Column()
  @ApiProperty({ description: 'School name' })
  schoolName: string;

  @Column()
  @ApiProperty({ description: 'Location' })
  location: string;

  @Column()
  @ApiProperty({
    description: 'Infrastructure type (ECD, Nursery, Primary, etc.)',
  })
  infrastructureType: string;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'Date donated (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  dateDonated: string;

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
