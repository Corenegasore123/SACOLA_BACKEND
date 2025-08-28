import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('eu_funded_projects')
export class EUFundedProject {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the EU-funded project' })
  id: string;

  @Column()
  @ApiProperty({ description: 'District where the project is located' })
  district: string;

  @Column()
  @ApiProperty({ description: 'Location of the project' })
  location: string;

  @Column()
  @ApiProperty({ description: 'Number of trees planted' })
  numberOfTrees: number;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({ description: 'Date when trees were planted (YYYY-MM-DD)' })
  datePlanted: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Description of the EU-funded project', required: false })
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
