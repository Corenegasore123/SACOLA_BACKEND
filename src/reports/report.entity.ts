import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'varchar' })
  projectCategory: 'Conservation' | 'Socio-Economic';

  @Column()
  projectType: string;

  @Column({ type: 'varchar' })
  reportType: 'Annual' | 'Monthly' | 'Custom';

  @Column({ type: 'date' })
  dateRangeStart: Date;

  @Column({ type: 'date' })
  dateRangeEnd: Date;

  @Column()
  generatedBy: string;

  @Column({ type: 'varchar' })
  status: 'In Progress' | 'Completed';

  @Column({ nullable: true })
  filePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


