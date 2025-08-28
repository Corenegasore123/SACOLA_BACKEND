import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tree_planting')
export class TreePlanting {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the tree planting entry' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Type of trees planted' })
  treeType: string;

  @Column()
  @ApiProperty({ description: 'Location where trees were planted' })
  location: string;

  @Column()
  @ApiProperty({ description: 'Number of trees planted' })
  numberOfTrees: number;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({ description: 'Date when trees were planted (YYYY-MM-DD)' })
  datePlanted: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Description of the tree planting project', required: false })
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
