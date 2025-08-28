import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('housing_houses_entries')
export class HousingHousesEntryData {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @Column()
  @ApiProperty({ description: 'House category (Vulnerable, Survivor, etc.)' })
  houseCategory: string;

  @Column()
  @ApiProperty({ description: 'House owner name' })
  houseOwner: string;

  @Column()
  @ApiProperty({ description: 'Location' })
  location: string;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'Date built (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  dateBuilt: string;

  @Column()
  @ApiProperty({ description: 'House condition (Good/Bad)' })
  houseCondition: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Materials provided', required: false })
  materials?: string;

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
