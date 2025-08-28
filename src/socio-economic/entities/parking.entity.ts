import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('parking_entries')
export class ParkingEntryData {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Parking name' })
  parkingName: string;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Cars supported' })
  carsSupported: number;

  @Column()
  @ApiProperty({ description: 'Location' })
  location: string;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'Date built (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  dateBuilt: string;

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
