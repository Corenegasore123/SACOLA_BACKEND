import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { EmpowermentMicroFinanceEntryData } from '../entities/empowerment-microfinance.entity';
import { CreateEmpowermentMicroFinanceDto } from '../dto/create-empowerment-microfinance.dto';
import { UpdateEmpowermentMicroFinanceDto } from '../dto/update-empowerment-microfinance.dto';

@Injectable()
export class EmpowermentMicroFinanceService {
  constructor(
    @InjectRepository(EmpowermentMicroFinanceEntryData)
    private readonly repo: Repository<EmpowermentMicroFinanceEntryData>,
  ) {}

  async create(dto: CreateEmpowermentMicroFinanceDto): Promise<EmpowermentMicroFinanceEntryData> {
    const entity = this.repo.create(dto as DeepPartial<EmpowermentMicroFinanceEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<EmpowermentMicroFinanceEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<EmpowermentMicroFinanceEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Microfinance record not found');
    return entity;
  }

  async update(id: string, dto: UpdateEmpowermentMicroFinanceDto): Promise<EmpowermentMicroFinanceEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


