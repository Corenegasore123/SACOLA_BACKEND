import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CustomProject } from './custom-project.entity';

@Entity('custom_project_entries')
export class CustomProjectEntry {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the project entry' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Name of the entry (e.g., beneficiary type, resource type)' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Number/count for this entry' })
  number: number;

  @ManyToOne(() => CustomProject, project => project.entries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  @ApiProperty({ description: 'The custom project this entry belongs to' })
  project: CustomProject;

  @Column({ type: 'uuid' })
  @ApiProperty({ description: 'ID of the associated custom project' })
  projectId: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the record was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp when the record was last updated' })
  updatedAt: Date;
}

