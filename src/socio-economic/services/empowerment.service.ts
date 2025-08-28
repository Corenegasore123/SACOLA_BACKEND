import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { EmpowermentTailoringEntryData } from '../entities/empowerment-project.entity';
import { CreateEmpowermentDto } from '../dto/create-empowerment.dto';
import { UpdateEmpowermentDto } from '../dto/update-empowerment.dto';

@Injectable()
export class EmpowermentTailoringService {
  constructor(
    @InjectRepository(EmpowermentTailoringEntryData)
    private readonly repo: Repository<EmpowermentTailoringEntryData>,
  ) {}

  async create(dto: CreateEmpowermentDto): Promise<EmpowermentTailoringEntryData> {
    const entity = this.repo.create(dto as DeepPartial<EmpowermentTailoringEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<EmpowermentTailoringEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<EmpowermentTailoringEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Empowerment project not found');
    return entity;
  }

  async update(id: string, dto: UpdateEmpowermentDto): Promise<EmpowermentTailoringEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


