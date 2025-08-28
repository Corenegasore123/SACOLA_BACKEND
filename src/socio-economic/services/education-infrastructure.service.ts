import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { EducationInfrastructuresEntryData } from '../entities/education-infrastructure.entity';
import { CreateEducationInfrastructureDto } from '../dto/create-education-infrastructure.dto';
import { UpdateEducationInfrastructureDto } from '../dto/update-education-infrastructure.dto';

@Injectable()
export class EducationInfrastructuresService {
  constructor(
    @InjectRepository(EducationInfrastructuresEntryData)
    private readonly repo: Repository<EducationInfrastructuresEntryData>,
  ) {}

  async create(dto: CreateEducationInfrastructureDto): Promise<EducationInfrastructuresEntryData> {
    const entity = this.repo.create(dto as DeepPartial<EducationInfrastructuresEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<EducationInfrastructuresEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<EducationInfrastructuresEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Education infrastructure not found');
    return entity;
  }

  async update(id: string, dto: UpdateEducationInfrastructureDto): Promise<EducationInfrastructuresEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


