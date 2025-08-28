import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('water_tanks')
export class WaterTank {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the water tank' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Type of water tank' })
  tankType: string;

  @Column()
  @ApiProperty({ description: 'Location where water tanks are installed' })
  location: string;

  @Column()
  @ApiProperty({ description: 'Number of water tanks' })
  numberOfTanks: number;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({ description: 'Date when water tanks were donated (YYYY-MM-DD)' })
  dateDonated: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Description of the water tank project', required: false })
  description: string;

  @Column()
  @ApiProperty({ description: 'Target number of beneficiaries' })
  targetBeneficiaries: number;

  @Column()
  @ApiProperty({ description: 'Current number of beneficiaries' })
  currentBeneficiaries: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the record was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp when the record was last updated' })
  updatedAt: Date;
}
