import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('conservation_projects')
export class ConservationProject {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the project' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'Name of the conservation project' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Description of the project', required: false })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'Location of the project' })
  location: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ description: 'Start date of the project', required: false })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ description: 'Expected end date of the project', required: false })
  endDate?: Date;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ 
    description: 'Current status of the project',
    enum: ['planned', 'in_progress', 'completed', 'on_hold', 'cancelled']
  })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiProperty({ description: 'Total budget for the project', required: false })
  budget?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Contact person for the project', required: false })
  contactPerson?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Email of the contact person', required: false })
  contactEmail?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Phone number of the contact person', required: false })
  contactPhone?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Additional notes about the project', required: false })
  notes?: string;



  @CreateDateColumn()
  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last updated date' })
  updatedAt: Date;

  // Helper method to get project status
  isActive(): boolean {
    return this.status === 'in_progress';
  }

  // Helper method to check if project is completed
  isCompleted(): boolean {
    return this.status === 'completed';
  }
}
