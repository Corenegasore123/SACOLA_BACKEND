import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('housing_villages_entries')
export class HousingVillagesEntryData {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Village name' })
  villageName: string;

  @Column()
  @ApiProperty({ description: 'Location' })
  location: string;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Total houses' })
  totalHouses: number;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'Date built (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  dateBuilt: string;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Good condition houses' })
  goodCondition: number;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Bad condition houses' })
  badCondition: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Bad condition description', required: false })
  badConditionDescription?: string;

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
