import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { HealthCentresEntryData } from '../entities/health-center.entity';
import { CreateHealthCenterDto } from '../dto/create-health-center.dto';
import { UpdateHealthCenterDto } from '../dto/update-health-center.dto';

@Injectable()
export class HealthCentresService {
  constructor(
    @InjectRepository(HealthCentresEntryData)
    private readonly repo: Repository<HealthCentresEntryData>,
  ) {}

  async create(dto: CreateHealthCenterDto): Promise<HealthCentresEntryData> {
    const entity = this.repo.create(dto as DeepPartial<HealthCentresEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<HealthCentresEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<HealthCentresEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Health center not found');
    return entity;
  }

  async update(id: string, dto: UpdateHealthCenterDto): Promise<HealthCentresEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


