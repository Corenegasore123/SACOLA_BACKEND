import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CustomProjectEntry } from './custom-project-entry.entity';

@Entity('custom_projects')
export class CustomProject {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the custom project' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Name of the custom project' })
  projectName: string;

  @Column()
  @ApiProperty({ description: 'Location of the project' })
  location: string;

  @Column({ type: 'date' })
  @ApiProperty({ description: 'Starting date of the project' })
  startingDate: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Description of the custom project', required: false })
  description: string;

  @OneToMany(() => CustomProjectEntry, entry => entry.project, { cascade: true })
  @ApiProperty({ description: 'List of project entries', type: [CustomProjectEntry] })
  entries: CustomProjectEntry[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the record was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp when the record was last updated' })
  updatedAt: Date;
}

