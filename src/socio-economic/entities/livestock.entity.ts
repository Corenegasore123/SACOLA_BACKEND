import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('livestock_entries')
export class LivestockEntryData {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Type of animal' })
  animalType: string;

  @Column()
  @ApiProperty({ description: 'Location' })
  location: string;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Number initially distributed' })
  distributedAnimals: number;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: 'Number born', required: false })
  born: number;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Number of deaths' })
  deaths: number;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Number sold' })
  soldAnimals: number;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Number transferred' })
  transferredAnimals: number;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Currently owned number' })
  currentlyOwned: number;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'Date when livestock was donated (YYYY-MM-DD format)',
  })
  dateDonated: string;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Target number of beneficiaries' })
  targetBeneficiaries: number;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Current number of beneficiaries' })
  currentBeneficiaries: number;

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
